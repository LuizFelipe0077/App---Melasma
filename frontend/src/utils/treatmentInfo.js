/**
 * treatmentInfo.js
 * Shared "day N of M / days remaining" math for the patient's active
 * protocol — used by both the dashboard header and the calendar page so the
 * two never drift out of sync.
 */
export function buildTreatmentInfo(dataInicio, dataFim) {
  if (!dataInicio || !dataFim) return null;
  const start = new Date(dataInicio);
  const end = new Date(dataFim);
  const today = new Date();
  const total = Math.max(1, Math.round((end - start) / 86400000) + 1);
  const remaining = Math.max(0, Math.ceil((end - today) / 86400000));
  const elapsed = Math.max(0, Math.min(total, Math.floor((today - start) / 86400000) + 1));
  return { total, remaining, elapsed, endLabel: end.toLocaleDateString('pt-BR') };
}
