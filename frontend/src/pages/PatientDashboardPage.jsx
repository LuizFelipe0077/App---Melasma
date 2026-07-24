import { useEffect, useMemo, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import DoseTimelineItem from '../components/DoseTimelineItem.jsx';
import HeatmapStrip from '../components/HeatmapStrip.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import RetroactiveCard from '../components/RetroactiveCard.jsx';
import Sheet from '../components/Sheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { prefetchDashboard, useDashboardData } from '../hooks/useDashboardData.js';
import { useLiberacoesData } from '../hooks/useLiberacoesData.js';
import { applyOptimisticCheckin, buildSlotsForDate } from '../utils/checkinSlots.js';
import { getMotivationMessage } from '../utils/motivationMessages.js';
import { buildTreatmentInfo } from '../utils/treatmentInfo.js';

function buildTodaySlots(dashboard) {
  return buildSlotsForDate(dashboard, new Date());
}

const GREETING_BY_HOUR = (hour) => {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function PatientDashboardPage() {
  const { session } = useAuth();
  const { showToast, showError } = useToast();
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [completingAll, setCompletingAll] = useState(false);

  const { dataInicio, dataFim } = useMemo(() => {
    const today = new Date();
    return {
      dataInicio: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
      dataFim: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
    };
  }, []);

  const { data: dashboard, loading, error, mutate } = useDashboardData(dataInicio, dataFim);

  // Mounting this hook here (not just inside RetroactiveCard) is what
  // actually warms the shared liberações cache on login — RetroactiveCard
  // and CalendarPage then read the same cache entry instead of each firing
  // their own fetch.
  const { data: liberacoesAtivas } = useLiberacoesData();

  // Warms the cache Histórico/Calendário will read from, in the background,
  // once the dashboard itself is done — so clicking into either page right
  // after login usually finds data already there instead of paying Apps
  // Script's own round-trip a second (and third) time. Ranges here must
  // match each page's own default calc exactly, or the cache key misses.
  useEffect(() => {
    if (loading || !dashboard) return;
    const today = new Date();
    prefetchDashboard(
      session.userId,
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30).toISOString(),
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
    );
    prefetchDashboard(
      session.userId,
      new Date(today.getFullYear(), today.getMonth(), 1).toISOString(),
      new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, dashboard, session.userId]);

  // Warms each active retroactive grant's own day range too, so tapping
  // "Registrar Retroativo" (or a highlighted calendar day) opens instantly
  // — RetroactiveCheckinSheet's useDashboardData call for that exact day is
  // already a cache hit by the time the user gets there.
  useEffect(() => {
    for (const liberacao of liberacoesAtivas) {
      const start = new Date(liberacao.dataLiberada);
      start.setHours(0, 0, 0, 0);
      const end = new Date(liberacao.dataLiberada);
      end.setHours(23, 59, 59, 999);
      prefetchDashboard(session.userId, start.toISOString(), end.toISOString());
    }
  }, [liberacoesAtivas, session.userId]);

  const slots = useMemo(() => buildTodaySlots(dashboard), [dashboard]);
  const pendingSlots = useMemo(() => slots.filter((s) => s.checkin.status === 'PENDENTE'), [slots]);
  const streak = dashboard?.gamificacao?.streakAtual ?? 0;
  const rate = dashboard?.taxaAdesaoGeral ?? 0;
  const treatment = useMemo(() => buildTreatmentInfo(session.dataInicio, session.dataFim), [session.dataInicio, session.dataFim]);

  const announceMilestone = (optimisticDashboard, streakBefore) => {
    const streakAfter = optimisticDashboard?.gamificacao?.streakAtual ?? 0;
    const isFirstCheckin = streakBefore === 0 && streakAfter === 1;
    const isPerfectDay = buildTodaySlots(optimisticDashboard).every((s) => s.checkin.status !== 'PENDENTE');
    return getMotivationMessage({
      isFirstCheckin,
      isPerfectDay,
      streakAfter,
      elapsedDays: treatment?.elapsed ?? 0,
      totalDays: treatment?.total ?? 0
    });
  };

  // Optimistic: the UI updates the instant the tap happens (dose card,
  // progress ring, weekly strip all read from `dashboard`, so one mutate()
  // refreshes all of them at once). The network call runs after, in the
  // background — on success its response (checkinId/status/streak/xpTotal,
  // already computed server-side) patches over the optimistic guess so the
  // two never drift; on failure the pre-mutation snapshot is restored.
  const handleCheck = async (suplemento, checkin) => {
    const previous = dashboard;
    const streakBefore = previous?.gamificacao?.streakAtual ?? 0;
    const optimistic = applyOptimisticCheckin(previous, suplemento, checkin, 'check');
    mutate(optimistic);

    const milestone = announceMilestone(optimistic, streakBefore);
    showToast({
      message: milestone || `${suplemento.nome} registrado`,
      actionLabel: 'Desfazer',
      duration: 4000,
      onAction: () => handleUndo(suplemento, { ...checkin, id: checkin.id || `temp-${Date.now()}` })
    });

    try {
      const result = await ApiClient.call('registrarCheckin', {
        suplementoId: suplemento.id,
        dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString()
      });
      mutate((current) => {
        if (!current) return current;
        const rawCheckins = current.rawCheckins.map((c) =>
          (c.id === result.checkinId || c.id.toString().startsWith('temp-')) && c.suplementoId === suplemento.id
            ? { ...c, id: result.checkinId, status: result.status }
            : c
        );
        return {
          ...current,
          rawCheckins,
          gamificacao: current.gamificacao ? { ...current.gamificacao, streakAtual: result.streak, xpTotal: result.xpTotal } : current.gamificacao
        };
      });
    } catch (err) {
      mutate(previous);
      showError(err.message);
    }
  };

  const handleUndo = async (suplemento, checkin) => {
    const previous = dashboard;
    mutate(applyOptimisticCheckin(previous, suplemento, checkin, 'undo'));

    try {
      await ApiClient.call('cancelarCheckin', { checkinId: checkin.id });
      showToast({ message: `${suplemento.nome} cancelado` });
    } catch (err) {
      mutate(previous);
      showError(err.message);
    }
  };

  // "Concluir todos" applies the same optimistic-then-sync pattern as a
  // single check-in, just folded over every still-pending dose at once —
  // no batch endpoint, each dose still goes through the exact same
  // registrarCheckin call an individual tap would make.
  const handleCompleteAll = async () => {
    const previous = dashboard;
    const targets = pendingSlots;
    let optimistic = previous;
    for (const slot of targets) {
      optimistic = applyOptimisticCheckin(optimistic, slot.suplemento, slot.checkin, 'check');
    }
    mutate(optimistic);
    setConfirmAllOpen(false);
    showToast({ message: 'Suplementos de hoje concluídos' });

    setCompletingAll(true);
    let failures = 0;
    for (const slot of targets) {
      try {
        await ApiClient.call('registrarCheckin', {
          suplementoId: slot.suplemento.id,
          dataHoraPrescrita: slot.checkin.dataHoraPrescrita.toISOString()
        });
      } catch {
        failures += 1;
      }
    }
    setCompletingAll(false);
    if (failures === targets.length && targets.length > 0) {
      mutate(previous);
      showError('Não foi possível concluir os suplementos. Tente novamente.');
    }
  };

  const nextPending = pendingSlots[0];

  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>{GREETING_BY_HOUR(new Date().getHours())}</div>
      <h1 className="display-md" style={{ marginBottom: 'var(--space-5)' }}>{session.nome.split(' ')[0]}</h1>

      <RetroactiveCard />

      {!loading && (
        <div className="dashboard-info-row">
          <div>
            <span className="eyebrow">Hoje faltam</span>
            <p className="body-md-strong">
              {pendingSlots.length} {pendingSlots.length === 1 ? 'suplemento' : 'suplementos'}
            </p>
          </div>
          {nextPending && (
            <div>
              <span className="eyebrow">Próximo horário</span>
              <p className="body-md-strong">{formatTime(nextPending.checkin.dataHoraPrescrita)}</p>
            </div>
          )}
          {treatment && (
            <div>
              <span className="eyebrow">Dias restantes</span>
              <p className="body-md-strong">{treatment.remaining}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col items-center" style={{ marginTop: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <ProgressRing value={rate} streak={streak} />
      </div>

      <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Sua semana</h2>
      <div className="surface surface-pad" style={{ marginBottom: 'var(--space-8)' }}>
        {loading ? <div className="skeleton" style={{ height: 40 }} /> : <HeatmapStrip rate={rate} />}
      </div>

      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="display-sm">Hoje</h2>
        {!loading && pendingSlots.length > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={() => setConfirmAllOpen(true)}>
            Concluir todos
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton" style={{ height: 64 }} />
          <div className="skeleton" style={{ height: 64 }} />
        </div>
      ) : error ? (
        <p className="empty-state">Não foi possível carregar seu dia: {error.message}</p>
      ) : slots.length === 0 ? (
        <p className="empty-state">Nenhum suplemento prescrito para hoje.</p>
      ) : (
        <div className="timeline">
          {slots.map((slot) => (
            <DoseTimelineItem
              key={`${slot.suplemento.id}-${slot.checkin.dataHoraPrescrita.getTime()}`}
              suplemento={slot.suplemento}
              checkin={slot.checkin}
              onCheck={handleCheck}
              onUndo={handleUndo}
            />
          ))}
        </div>
      )}

      <Sheet
        open={confirmAllOpen}
        onClose={() => !completingAll && setConfirmAllOpen(false)}
        title="Concluir todos os suplementos de hoje"
        description="Você confirma que tomou corretamente todos os suplementos programados para hoje?"
      >
        <div className="flex gap-3 justify-end">
          <button className="btn btn-ghost" disabled={completingAll} onClick={() => setConfirmAllOpen(false)}>Cancelar</button>
          <button className="btn btn-fill" disabled={completingAll} onClick={handleCompleteAll}>
            {completingAll ? <span className="spinner" /> : 'Confirmar'}
          </button>
        </div>
      </Sheet>
    </>
  );
}
