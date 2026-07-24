import { useEffect, useMemo, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import DoseTimelineItem from './DoseTimelineItem.jsx';
import Sheet from './Sheet.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * Builds check-in slots for one specific past date (not "today" — see
 * PatientDashboardPage's buildTodaySlots, which this mirrors but
 * parameterized by date instead of hardcoded to now).
 */
function buildSlotsForDate(dashboard, targetDate) {
  const activeSuplementos = dashboard?.historicoAgrupadoPorSuplemento || [];
  const rawCheckins = dashboard?.rawCheckins || [];
  const targetStr = targetDate.toDateString();
  const slots = [];

  for (const sup of activeSuplementos) {
    for (const horario of sup.horarios) {
      const prescribedTime = new Date(targetDate);
      const [hours, minutes] = horario.split(':');
      prescribedTime.setHours(Number(hours), Number(minutes), 0, 0);

      const match = rawCheckins.find((c) => {
        if (c.suplementoId !== sup.suplementoId) return false;
        const cDate = new Date(c.dataHoraPrescrita);
        return cDate.toDateString() === targetStr && cDate.getHours() === Number(hours) && cDate.getMinutes() === Number(minutes);
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

export default function RetroactiveCheckinSheet({ open, dataLiberada, onClose }) {
  const { showToast, showError } = useToast();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const targetDate = useMemo(() => (dataLiberada ? new Date(dataLiberada) : null), [dataLiberada]);

  const load = () => {
    if (!targetDate) return;
    setLoading(true);
    setError(null);
    const iso = targetDate.toISOString();
    ApiClient.call('gerarDashboard', { dataInicio: iso, dataFim: iso })
      .then(setDashboard)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dataLiberada]);

  const slots = useMemo(() => (targetDate ? buildSlotsForDate(dashboard, targetDate) : []), [dashboard, targetDate]);

  const handleCheck = async (suplemento, checkin) => {
    try {
      await ApiClient.call('registrarCheckin', {
        suplementoId: suplemento.id,
        dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString()
      });
      showToast({ message: `${suplemento.nome} registrado` });
      load();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUndo = async (suplemento, checkin) => {
    try {
      await ApiClient.call('cancelarCheckin', { checkinId: checkin.id });
      showToast({ message: `${suplemento.nome} cancelado` });
      load();
    } catch (err) {
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
