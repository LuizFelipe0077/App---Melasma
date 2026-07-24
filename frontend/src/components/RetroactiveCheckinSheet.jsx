import { useMemo } from 'react';
import { ApiClient } from '../api/apiClient.js';
import DoseTimelineItem from './DoseTimelineItem.jsx';
import Sheet from './Sheet.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { applyOptimisticCheckin, buildSlotsForDate } from '../utils/checkinSlots.js';

function dayRange(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export default function RetroactiveCheckinSheet({ open, dataLiberada, onClose }) {
  const { showError } = useToast();

  const targetDate = useMemo(() => (dataLiberada ? new Date(dataLiberada) : null), [dataLiberada]);
  const { start, end } = useMemo(() => (targetDate ? dayRange(targetDate) : { start: null, end: null }), [targetDate]);

  // Same hook/cache the main dashboard uses — the day was already prefetched
  // (see PatientDashboardPage's warmup effect for each active grant), so
  // this is normally an instant cache hit, not a fresh network wait.
  const { data: dashboard, loading, error, mutate } = useDashboardData(
    start ? start.toISOString() : null,
    end ? end.toISOString() : null
  );

  const slots = useMemo(() => (targetDate ? buildSlotsForDate(dashboard, targetDate) : []), [dashboard, targetDate]);

  // Same optimistic-then-sync pattern as the "Hoje" dashboard: mutate()
  // synchronously before the network call, patch the server's authoritative
  // response over it on success, roll back to the pre-tap snapshot on
  // failure — no reload-after-every-tap, no spinner, no full refetch.
  const handleCheck = async (suplemento, checkin) => {
    const previous = dashboard;
    mutate(applyOptimisticCheckin(previous, suplemento, checkin, 'check'));

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
    } catch (err) {
      mutate(previous);
      showError(err.message);
    }
  };

  const title = targetDate ? `Retroativo — ${targetDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}` : 'Retroativo';

  return (
    <Sheet open={open} onClose={onClose} title={title} description="Registre aqui apenas os suplementos deste dia liberado.">
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton" style={{ height: 64 }} />
          <div className="skeleton" style={{ height: 64 }} />
        </div>
      ) : error ? (
        <p className="empty-state">Não foi possível carregar este dia: {error.message}</p>
      ) : slots.length === 0 ? (
        <p className="empty-state">Nenhum suplemento prescrito para este dia.</p>
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
    </Sheet>
  );
}
