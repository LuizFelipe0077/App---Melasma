import { useMemo, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData.js';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const WEEKDAY_HEADERS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

function buildMonthCells(year, month, dayStatus) {
  const firstDay = new Date(year, month, 1);
  const leadingBlanks = (firstDay.getDay() + 6) % 7; // Monday-first grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: leadingBlanks }, (_, i) => ({ empty: true, key: `blank-${i}` }));
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = new Date(year, month, day).toDateString();
    cells.push({ empty: false, day, key: dateKey, status: dayStatus.get(dateKey) });
  }
  return cells;
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const { dataInicio, dataFim } = useMemo(() => {
    const start = new Date(cursor.year, cursor.month, 1);
    const end = new Date(cursor.year, cursor.month + 1, 0, 23, 59, 59);
    return { dataInicio: start.toISOString(), dataFim: end.toISOString() };
  }, [cursor]);

  const { data, loading, error } = useDashboardData(dataInicio, dataFim);

  const dayStatus = useMemo(() => {
    const map = new Map();
    for (const c of data?.rawCheckins || []) {
      const key = new Date(c.dataHoraPrescrita).toDateString();
      const entry = map.get(key) || { completed: 0, missed: 0, pending: 0 };
      if (c.status === 'CONCLUIDO') entry.completed++;
      else if (c.status === 'ATRASADO') entry.missed++;
      else entry.pending++;
      map.set(key, entry);
    }
    return map;
  }, [data]);

  const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month, dayStatus), [cursor, dayStatus]);

  const goToMonth = (delta) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <>
      <header className="header mb-6">
        <div>
          <h1 className="text-h1 text-2xl">Calendário</h1>
          <p className="text-p">Visão mensal das suas doses.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline btn-sm" onClick={() => goToMonth(-1)} aria-label="Mês anterior">←</button>
          <span className="font-semibold" style={{ minWidth: 140, textAlign: 'center' }}>
            {MONTH_NAMES[cursor.month]} {cursor.year}
          </span>
          <button className="btn btn-outline btn-sm" onClick={() => goToMonth(1)} aria-label="Próximo mês">→</button>
        </div>
      </header>

      <section className="card">
        {error ? (
          <p className="error-text">Falha ao carregar calendário: {error.message}</p>
        ) : (
          <>
            <div className="month-grid mb-2">
              {WEEKDAY_HEADERS.map((d, i) => (
                <div key={i} className="text-xs text-tertiary text-center font-semibold" style={{ padding: 4 }}>{d}</div>
              ))}
            </div>
            <div className="month-grid">
              {loading
                ? Array.from({ length: 35 }, (_, i) => <div key={i} className="skeleton" style={{ aspectRatio: 1 }} />)
                : cells.map((cell) =>
                    cell.empty ? (
                      <div key={cell.key} className="month-cell empty" />
                    ) : (
                      <div key={cell.key} className={`month-cell${cell.status ? ' has-data' : ''}`}>
                        <span>{cell.day}</span>
                        {cell.status && (
                          <div className="flex gap-1">
                            {cell.status.completed > 0 && <span className="dot completed" title={`${cell.status.completed} concluído(s)`} />}
                            {cell.status.missed > 0 && <span className="dot missed" title={`${cell.status.missed} atrasado(s)`} />}
                          </div>
                        )}
                      </div>
                    )
                  )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
