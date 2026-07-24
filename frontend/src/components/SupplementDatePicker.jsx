import { useState } from 'react';
import { buildMonthCells, endOfDay, shiftMonth, startOfDay } from '../utils/monthGrid.js';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
export const WEEKDAY_CODES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MODES = [
  { value: 'todos', label: 'Todos os dias' },
  { value: 'dias_alternados', label: 'Dias alternados' },
  { value: 'semana', label: 'Dias da semana' },
  { value: 'especificas', label: 'Datas específicas' }
];

function protocolAccent(protocoloNome) {
  const normalized = (protocoloNome || '').toLowerCase();
  if (normalized.includes('desinflama')) return 'var(--p-desinf-accent)';
  if (normalized.includes('melasma')) return 'var(--p-melasma-accent)';
  return 'var(--p-inst-accent)';
}

/**
 * Replaces the old "Repetição" dropdown inside SupplementFields — a
 * protocol-tinted visual calendar with 4 modes. "Todos os dias" / "Dias
 * alternados" / "Dias da semana" all still produce the same `diasSemana`
 * weekday-pattern strings the backend has always understood (read-only
 * preview of the resulting dates); "Datas específicas" is the new
 * capability — click individual dates to toggle them, producing
 * `datasEspecificas` (exact calendar dates, no repetition).
 *
 * `schedule` shape: { mode, weekdays: string[], specificDates: Date[] }.
 */
export default function SupplementDatePicker({ dataInicio, dataFim, protocoloNome, schedule, onChange }) {
  const treatmentStart = dataInicio ? startOfDay(new Date(dataInicio)) : null;
  const treatmentEnd = dataFim ? endOfDay(new Date(dataFim)) : null;
  const [cursor, setCursor] = useState(() => {
    const base = treatmentStart || new Date();
    return { year: base.getFullYear(), month: base.getMonth() };
  });

  const accent = protocolAccent(protocoloNome);
  const interactive = schedule.mode === 'especificas';

  const isInRange = (date) => (!treatmentStart || date >= treatmentStart) && (!treatmentEnd || date <= treatmentEnd);

  const isDateActive = (date) => {
    if (!isInRange(date)) return false;
    if (schedule.mode === 'todos') return true;
    if (schedule.mode === 'dias_alternados') {
      if (!treatmentStart) return false;
      const diffDays = Math.floor((startOfDay(date) - treatmentStart) / 86400000);
      return diffDays % 2 === 0;
    }
    if (schedule.mode === 'semana') {
      return schedule.weekdays.includes(WEEKDAY_CODES[date.getDay()]);
    }
    if (schedule.mode === 'especificas') {
      return schedule.specificDates.some((d) => d.toDateString() === date.toDateString());
    }
    return false;
  };

  const toggleWeekday = (code) => {
    const next = schedule.weekdays.includes(code) ? schedule.weekdays.filter((w) => w !== code) : [...schedule.weekdays, code];
    onChange({ ...schedule, weekdays: next });
  };

  const toggleDate = (date) => {
    const exists = schedule.specificDates.some((d) => d.toDateString() === date.toDateString());
    const next = exists ? schedule.specificDates.filter((d) => d.toDateString() !== date.toDateString()) : [...schedule.specificDates, date];
    onChange({ ...schedule, specificDates: next });
  };

  const cells = buildMonthCells(cursor.year, cursor.month);

  return (
    <div className="date-picker">
      <div className="date-picker-modes">
        {MODES.map((m) => (
          <button
            key={m.value} type="button"
            className={`date-picker-mode-btn${schedule.mode === m.value ? ' active' : ''}`}
            style={schedule.mode === m.value ? { background: accent, borderColor: accent } : undefined}
            onClick={() => onChange({ ...schedule, mode: m.value })}
          >
            {m.label}
          </button>
        ))}
      </div>

      {schedule.mode === 'semana' && (
        <div className="date-picker-weekdays">
          {WEEKDAY_CODES.map((code) => (
            <button
              key={code} type="button"
              className={`date-picker-weekday-btn${schedule.weekdays.includes(code) ? ' active' : ''}`}
              style={schedule.weekdays.includes(code) ? { background: accent, borderColor: accent } : undefined}
              onClick={() => toggleWeekday(code)}
            >
              {code}
            </button>
          ))}
        </div>
      )}

      <div className="date-picker-month-nav">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCursor((p) => shiftMonth(p, -1))} aria-label="Mês anterior">←</button>
        <span>{MONTH_NAMES[cursor.month]} {cursor.year}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCursor((p) => shiftMonth(p, 1))} aria-label="Próximo mês">→</button>
      </div>

      <div className="date-picker-grid">
        {cells.map((cell) =>
          cell.empty ? (
            <div key={cell.key} className="date-picker-cell empty" />
          ) : (
            <button
              key={cell.key}
              type="button"
              className={`date-picker-cell${isInRange(cell.date) ? '' : ' out-of-range'}${isDateActive(cell.date) ? ' active' : ''}${interactive ? ' interactive' : ''}`}
              style={isDateActive(cell.date) ? { background: accent } : undefined}
              disabled={!interactive || !isInRange(cell.date)}
              onClick={() => toggleDate(cell.date)}
            >
              {cell.day}
            </button>
          )
        )}
      </div>
    </div>
  );
}
