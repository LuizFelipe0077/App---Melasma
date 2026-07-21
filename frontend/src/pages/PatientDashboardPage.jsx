import { useMemo, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import DoseTimelineItem from '../components/DoseTimelineItem.jsx';
import HeatmapStrip from '../components/HeatmapStrip.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import Sheet from '../components/Sheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';

function buildTodaySlots(dashboard) {
  const activeSuplementos = dashboard?.historicoAgrupadoPorSuplemento || [];
  const rawCheckins = dashboard?.rawCheckins || [];
  const todayStr = new Date().toDateString();
  const slots = [];

  for (const sup of activeSuplementos) {
    for (const horario of sup.horarios) {
      const prescribedTime = new Date();
      const [hours, minutes] = horario.split(':');
      prescribedTime.setHours(Number(hours), Number(minutes), 0, 0);

      const match = rawCheckins.find((c) => {
        if (c.suplementoId !== sup.suplementoId) return false;
        const cDate = new Date(c.dataHoraPrescrita);
        return cDate.toDateString() === todayStr && cDate.getHours() === Number(hours) && cDate.getMinutes() === Number(minutes);
      });

      const checkinInfo = match
        ? { id: match.id, status: match.status, dataHoraPrescrita: prescribedTime, dataHoraRealizada: match.dataHoraRealizada ? new Date(match.dataHoraRealizada) : null }
        : { id: null, status: 'PENDENTE', dataHoraPrescrita: prescribedTime, dataHoraRealizada: null };

      slots.push({
        suplemento: { id: sup.suplementoId, nome: sup.nome, dosagem: sup.dosagem, instrucoes: sup.instrucoes },
        checkin: checkinInfo
      });
    }
  }

  return slots.sort((a, b) => a.checkin.dataHoraPrescrita - b.checkin.dataHoraPrescrita);
}

const GREETING_BY_HOUR = (hour) => {
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

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

  const { data: dashboard, loading, error, reload } = useDashboardData(dataInicio, dataFim);

  const slots = useMemo(() => buildTodaySlots(dashboard), [dashboard]);
  const pendingSlots = useMemo(() => slots.filter((s) => s.checkin.status === 'PENDENTE'), [slots]);
  const streak = dashboard?.gamificacao?.streakAtual ?? 0;
  const rate = dashboard?.taxaAdesaoGeral ?? 0;

  const handleCheck = async (suplemento, checkin) => {
    try {
      const result = await ApiClient.call('registrarCheckin', {
        suplementoId: suplemento.id,
        dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString()
      });
      showToast({
        message: `${suplemento.nome} registrado`,
        actionLabel: 'Desfazer',
        duration: 4000,
        onAction: async () => {
          try {
            await ApiClient.call('cancelarCheckin', { checkinId: result.checkinId });
          } catch (err) {
            showError(err.message);
          } finally {
            reload();
          }
        }
      });
      reload();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUndo = async (suplemento, checkin) => {
    try {
      await ApiClient.call('cancelarCheckin', { checkinId: checkin.id });
      showToast({ message: `${suplemento.nome} cancelado` });
      reload();
    } catch (err) {
      showError(err.message);
    }
  };

  // "Concluir todos" only automates the UI: every still-pending dose is sent
  // through the exact same registrarCheckin call an individual tap would
  // make, one at a time — no batch endpoint, no change to how a check-in is
  // persisted. A failure on one slot (e.g. it was already confirmed by the
  // time this runs) is swallowed so the rest of the batch still goes through.
  const handleCompleteAll = async () => {
    setCompletingAll(true);
    try {
      for (const slot of pendingSlots) {
        try {
          await ApiClient.call('registrarCheckin', {
            suplementoId: slot.suplemento.id,
            dataHoraPrescrita: slot.checkin.dataHoraPrescrita.toISOString()
          });
        } catch {
          // already handled / duplicate — continue with the rest of the batch
        }
      }
      showToast({ message: 'Suplementos de hoje concluídos' });
      await reload();
    } finally {
      setCompletingAll(false);
      setConfirmAllOpen(false);
    }
  };

  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>{GREETING_BY_HOUR(new Date().getHours())}</div>
      <h1 className="display-md" style={{ marginBottom: 'var(--space-7)' }}>{session.nome.split(' ')[0]}</h1>

      <div className="flex flex-col items-center" style={{ marginBottom: 'var(--space-8)' }}>
        <ProgressRing value={rate} streak={streak} />
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

      <h2 className="display-sm" style={{ margin: 'var(--space-8) 0 var(--space-4)' }}>Sua semana</h2>
      <div className="surface surface-pad">
        {loading ? <div className="skeleton" style={{ height: 40 }} /> : <HeatmapStrip rate={rate} />}
      </div>

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
