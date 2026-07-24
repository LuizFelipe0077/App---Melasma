/**
 * ScheduleMatcher.js
 * Single source of truth for "is this supplement active on this calendar
 * day" — used both at patient-creation time (to pre-generate PENDENTE
 * check-in rows for the whole treatment) and at dashboard-generation time
 * (to count prescribed doses in a range). Previously duplicated verbatim in
 * CriarPacienteUseCase.js and GerarDashboardUseCase.js; extracted here so
 * the two can never drift.
 *
 * `datasEspecificas`, when non-empty, takes precedence over `diasSemana`
 * entirely — a supplement scheduled on exact calendar dates ignores any
 * weekday-pattern matching. Existing supplements (created before this
 * field existed) simply never carry it, so `diasSemana` matching is
 * unaffected for them.
 */
export function isDayActive(currentDate, dataInicio, diasSemana, datasEspecificas) {
  if (Array.isArray(datasEspecificas) && datasEspecificas.length > 0) {
    return datasEspecificas.some((d) => sameCalendarDay(d, currentDate));
  }

  if (!Array.isArray(diasSemana) || diasSemana.includes('todos') || diasSemana.includes('Todos os dias')) return true;

  const weekdayMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayStr = weekdayMap[currentDate.getDay()];

  // Specific weekdays
  if (diasSemana.includes(dayStr)) return true;

  // Weekends
  if (diasSemana.includes('finais_de_semana') || diasSemana.includes('Finais de semana')) {
    const dayNum = currentDate.getDay();
    if (dayNum === 0 || dayNum === 6) return true;
  }

  // Alternate days
  if (diasSemana.includes('dias_alternados') || diasSemana.includes('Dias alternados')) {
    const diffTime = Math.abs(currentDate.getTime() - dataInicio.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays % 2 === 0) return true;
  }

  return false;
}

export function sameCalendarDay(a, b) {
  const dateA = a instanceof Date ? a : new Date(a);
  const dateB = b instanceof Date ? b : new Date(b);
  return dateA.toDateString() === dateB.toDateString();
}
