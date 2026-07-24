import { useMemo, useState } from 'react';
import HeatmapMonth from '../components/HeatmapMonth.jsx';
import RetroactiveCheckinSheet from '../components/RetroactiveCheckinSheet.jsx';
import Sheet from '../components/Sheet.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';
import { useLiberacoesData } from '../hooks/useLiberacoesData.js';
import { buildDayRecords } from '../utils/buildDayRecords.js';
import { buildTreatmentInfo } from '../utils/treatmentInfo.js';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const STATUS_LABEL = { CONCLUIDO: '✔ Tomou', ATRASADO: '✔ Tomou (atrasado)', PENDENTE: '✖ Não tomou' };

const LEGEND = [
  { cls: 'completed', label: 'Dia perfeito — tudo concluído' },
  { cls: 'partial', label: 'Parcial — algumas doses pendentes' },
  { cls: 'missed', label: 'Sem check-in registrado' },
  { cls: 'future', label: 'Ainda não chegou' },
  { cls: 'today', label: 'Hoje', swatchStyle: { boxShadow: 'inset 0 0 0 3px var(--ink)', background: 'var(--surface-sunken)' } },
  { cls: 'released', label: 'Retroativo liberado', swatchStyle: { boxShadow: 'inset 0 0 0 3px var(--retroactive)', background: 'var(--surface-sunken)' } }
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
  const [retroSheetDate, setRetroSheetDate] = useState(null);
  const { data: liberacoesAtivas } = useLiberacoesData();

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
    const records = buildDayRecords(data, session.dataInicio, start, end);
    if (!liberacoesAtivas || liberacoesAtivas.length === 0) return records;
    const releasedKeys = new Set(liberacoesAtivas.map((l) => new Date(l.dataLiberada).toDateString()));
    return records.map((d) => (releasedKeys.has(d.date.toDateString()) ? { ...d, released: true } : d));
  }, [data, session.dataInicio, cursor, liberacoesAtivas]);

  const handleDayClick = (day) => {
    if (day.released) {
      setRetroSheetDate(day.date);
    } else {
      setSelectedDay(day);
    }
  };

  const treatmentInfo = useMemo(() => buildTreatmentInfo(session.dataInicio, session.dataFim), [session.dataInicio, session.dataFim]);

  const goToMonth = (delta) => {
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mobile-stack-center" style={{ marginBottom: 'var(--space-2)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 className="display-md">Calendário</h1>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(-1)} aria-label="Mês anterior">←</button>
          <span style={{ minWidth: 130, textAlign: 'center', fontWeight: 'var(--weight-medium)' }}>{MONTH_NAMES[cursor.month]} {cursor.year}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => goToMonth(1)} aria-label="Próximo mês">→</button>
        </div>
      </div>

      {treatmentInfo && (
        <div className="calendar-treatment-badge">
          <div>
            <span className="eyebrow">Dia do tratamento</span>
            <p className="display-sm" style={{ marginTop: 2 }}>{treatmentInfo.elapsed} de {treatmentInfo.total}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="eyebrow">Faltam</span>
            <p className="display-sm" style={{ marginTop: 2 }}>{treatmentInfo.remaining} dias</p>
          </div>
        </div>
      )}

      <section className="surface surface-pad">
        {error ? (
          <p className="empty-state">Não foi possível carregar o calendário: {error.message}</p>
        ) : loading ? (
          <div className="skeleton" style={{ height: 260 }} />
        ) : (
          <>
            <HeatmapMonth year={cursor.year} month={cursor.month} days={days} onDayClick={handleDayClick} />
            <div className="calendar-legend">
              {LEGEND.map((l) => (
                <div className="calendar-legend-item" key={l.cls}>
                  <span className={`calendar-legend-swatch heatmap-month-cell ${l.cls}`} style={{ borderRadius: 3, ...(l.swatchStyle || {}) }} />
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

      {retroSheetDate && (
        <RetroactiveCheckinSheet
          open={!!retroSheetDate}
          dataLiberada={retroSheetDate.toISOString()}
          onClose={() => setRetroSheetDate(null)}
        />
      )}
    </>
  );
}
