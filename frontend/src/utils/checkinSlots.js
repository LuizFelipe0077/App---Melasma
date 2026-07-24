/**
 * Shared between PatientDashboardPage (today) and RetroactiveCheckinSheet
 * (an arbitrary past date liberada) — the exact same slot-building and
 * optimistic-update math, parameterized by date instead of duplicated with
 * `new Date()` hardcoded in one copy and a target date in the other.
 */

/** Builds check-in slots for one specific calendar date. */
export function buildSlotsForDate(dashboard, targetDate) {
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

/**
 * Applies a check/undo to a local copy of the dashboard payload, mirroring
 * exactly what the backend would compute (RegistrarCheckinUseCase /
 * CancelarCheckinUseCase: ±10 XP, ±1 streak, ±1 consumido) — this is what
 * makes the optimistic update safe to show before the network confirms it.
 */
export function applyOptimisticCheckin(dashboard, suplemento, checkin, action) {
  if (!dashboard) return dashboard;
  const delta = action === 'check' ? 1 : -1;
  const nowIso = new Date().toISOString();

  const existingIndex = dashboard.rawCheckins.findIndex((c) => c.id === checkin.id);
  const nextRawCheckins = [...dashboard.rawCheckins];
  if (existingIndex >= 0) {
    nextRawCheckins[existingIndex] = {
      ...nextRawCheckins[existingIndex],
      status: action === 'check' ? 'CONCLUIDO' : 'PENDENTE',
      dataHoraRealizada: action === 'check' ? nowIso : null
    };
  } else if (action === 'check') {
    nextRawCheckins.push({
      id: `temp-${Date.now()}`,
      suplementoId: suplemento.id,
      dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString(),
      dataHoraRealizada: nowIso,
      status: 'CONCLUIDO',
      retroativo: false
    });
  }

  const totalConsumido = Math.max(0, dashboard.totalConsumido + delta);
  const taxaAdesaoGeral = dashboard.totalPrescrito > 0 ? Math.round((totalConsumido / dashboard.totalPrescrito) * 100) : 0;

  const historicoAgrupadoPorSuplemento = dashboard.historicoAgrupadoPorSuplemento.map((sup) => {
    if (sup.suplementoId !== suplemento.id) return sup;
    const consumido = Math.max(0, sup.consumido + delta);
    const perdido = Math.max(0, sup.prescrito - consumido - sup.atrasado);
    return { ...sup, consumido, perdido, taxaAdesao: sup.prescrito > 0 ? Math.round((consumido / sup.prescrito) * 100) : 0 };
  });

  return {
    ...dashboard,
    rawCheckins: nextRawCheckins,
    totalConsumido,
    taxaAdesaoGeral,
    historicoAgrupadoPorSuplemento,
    gamificacao: dashboard.gamificacao
      ? {
          ...dashboard.gamificacao,
          xpTotal: Math.max(0, dashboard.gamificacao.xpTotal + delta * 10),
          streakAtual: Math.max(0, dashboard.gamificacao.streakAtual + delta)
        }
      : dashboard.gamificacao
  };
}
