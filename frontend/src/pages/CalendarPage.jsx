import { useMemo, useState } from 'react';
import HeatmapMonth from '../components/HeatmapMonth.jsx';
import Sheet from '../components/Sheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { buildDayRecords } from '../utils/buildDayRecords.js';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const STATUS_LABEL = { CONCLUIDO: '✔ Tomou', ATRASADO: '✔ Tomou (atrasado)', PENDENTE: '✖ Não tomou' };

const LEGEND = [
  { cls: 'completed', label: 'Dia perfeito — tudo concluído' },
  { cls: 'partial', label: 'Parcial — algumas doses pendentes' },
  { cls: 'missed', label: 'Sem check-in registrado' },
  { cls: 'future', label: 'Ainda não chegou' }
];

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function CalendarPage() {
  const { session } = useAuth();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const { dataInicio, dataFim } = useMemo(() => {
    const start = new Date(cursor.year, cursor.month, 1);
    const end = new Date(cursor.year, cursor.month + 1, 0, 23, 59, 59);
    return { dataInicio: start.toISOString(), dataFim: end.toISOString() };
  }, [cursor]);

  const { data, loading, error } = useDashboardData(dataInicio, dataFim);

  const days = useMemo(() => {
    if (!data || !session.dataInicio) return [];
    const start = new Date(cursor.year, cursor.month, 1);
    const end = new Date(cursor.year, cursor.month + 1, 0);
    return buildDayRecords(data, session.dataInicio, start, end);
  }, [data, session.dataInicio, cursor]);

  const treatmentInfo = useMemo(() => {
    if (!session.dataInicio || !session.dataFim) return null;
    const start = new Date(session.dataInicio);
    const end = new Date(session.dataFim);
    const today = new Date();
    const total = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const remaining = Math.max(0, Math.ceil((end - today) / 86400000));
    return { total, remaining, endLabel: end.toLocaleDateString('pt-BR') };
  }, [session.dataInicio, session.dataFim]);

  const goToMonth = (delta) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 className="display-md">Calendário</h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(-1)} aria-label="Mês anterior">←</button>
          <span style={{ minWidth: 130, textAlign: 'center', fontWeight: 'var(--weight-medium)' }}>{MONTH_NAMES[cursor.month]} {cursor.year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(1)} aria-label="Próximo mês">→</button>
        </div>
      </div>

      {treatmentInfo && (
        <p className="body-sm" style={{ marginBottom: 'var(--space-6)' }}>
          Faltam <strong style={{ color: 'var(--ink)' }}>{treatmentInfo.remaining} dias</strong> para o fim do tratamento — término previsto em {treatmentInfo.endLabel}.
        </p>
      )}

      <section className="surface surface-pad">
        {error ? (
          <p className="empty-state">Não foi possível carregar o calendário: {error.message}</p>
        ) : loading ? (
          <div className="skeleton" style={{ height: 260 }} />
        ) : (
          <>
            <HeatmapMonth year={cursor.year} month={cursor.month} days={days} onDayClick={setSelectedDay} />
            <div className="calendar-legend">
              {LEGEND.map((l) => (
                <div className="calendar-legend-item" key={l.cls}>
                  <span className={`calendar-legend-swatch heatmap-month-cell ${l.cls}`} style={{ borderRadius: 3 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <Sheet
        open={!!selectedDay}
        onClose={() => setSelectedDay(null)}
        title={selectedDay ? `Dia ${selectedDay.dayNumber}${treatmentInfo ? ` de ${treatmentInfo.total}` : ''}` : ''}
        description={selectedDay ? selectedDay.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : ''}
      >
        {selectedDay && (
          selectedDay.status === 'future' ? (
            <p className="body-sm">O tratamento deste dia ainda não foi iniciado.</p>
          ) : selectedDay.checkins.length === 0 ? (
            <p className="empty-state">Nenhuma dose registrada neste dia.</p>
          ) : (
            <div>
              {selectedDay.checkins.map((c) => (
                <div key={c.id} className="day-detail-row">
                  <div>
                    <div className="dose-name">{c.suplemento?.nome || 'Suplemento'}</div>
                    <div className="dose-meta">
                      {formatTime(c.dataHoraPrescrita)}
                      {c.dataHoraRealizada && ` · check-in às ${formatTime(c.dataHoraRealizada)}`}
                    </div>
                  </div>
                  <span className={`chip ${c.status === 'PENDENTE' ? 'chip-danger' : c.status === 'ATRASADO' ? 'chip-warning' : 'chip-success'}`}>
                    {STATUS_LABEL[c.status] || c.status}
                  </span>
                </div>
              ))}
              {selectedDay.status !== 'future' && new Date(selectedDay.date).toDateString() !== new Date().toDateString() && selectedDay.checkins.some((c) => c.status === 'PENDENTE') && (
                <p className="body-sm" style={{ marginTop: 'var(--space-4)' }}>
                  Dias anteriores só podem ser preenchidos com liberação do seu profissional.
                </p>
              )}
            </div>
          )
        )}
      </Sheet>
    </>
  );
}
