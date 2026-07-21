import { useMemo, useState } from 'react';
import HeatmapMonth from '../components/HeatmapMonth.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

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
      const entry = map.get(key) || { completed: 0, missed: 0 };
      if (c.status === 'CONCLUIDO') entry.completed++;
      else if (c.status === 'ATRASADO') entry.missed++;
      map.set(key, entry);
    }
    return map;
  }, [data]);

  const goToMonth = (delta) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="display-md">Calendário</h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(-1)} aria-label="Mês anterior">←</button>
          <span style={{ minWidth: 130, textAlign: 'center', fontWeight: 'var(--weight-medium)' }}>{MONTH_NAMES[cursor.month]} {cursor.year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(1)} aria-label="Próximo mês">→</button>
        </div>
      </div>

      <section className="surface surface-pad">
        {error ? (
          <p className="empty-state">Não foi possível carregar o calendário: {error.message}</p>
        ) : loading ? (
          <div className="skeleton" style={{ height: 260 }} />
        ) : (
          <HeatmapMonth year={cursor.year} month={cursor.month} dayStatus={dayStatus} />
        )}
      </section>
    </>
  );
}
