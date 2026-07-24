import { buildMonthCells } from '../utils/monthGrid.js';

const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function buildCells(year, month, days) {
  const byDate = new Map(days.map((d) => [d.date.toDateString(), d]));
  return buildMonthCells(year, month).map((cell) => (cell.empty ? cell : { ...cell, record: byDate.get(cell.key) }));
}

export default function HeatmapMonth({ year, month, days, onDayClick }) {
  const cells = buildCells(year, month, days);
  const todayKey = new Date().toDateString();

  return (
    <>
      <div className="heatmap-month-grid heatmap-month-weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <div className="heatmap-month-weekday" key={label}>{label}</div>
        ))}
      </div>
      <div className="heatmap-month-grid">
        {cells.map((cell) =>
          cell.empty ? (
            <div key={cell.key} className="heatmap-month-cell empty" />
          ) : (
            <div
              key={cell.key}
              className={`heatmap-month-cell ${cell.record?.status || ''}${onDayClick ? ' clickable' : ''}${cell.key === todayKey ? ' today' : ''}${cell.record?.released ? ' released' : ''}`}
              onClick={() => cell.record && onDayClick?.(cell.record)}
              role={onDayClick ? 'button' : undefined}
              aria-label={`Dia ${cell.day}${cell.record?.released ? ' — retroativo liberado' : ''}`}
            >
              {cell.day}
              {cell.record?.released && <span className="heatmap-month-cell-badge" aria-hidden="true">🔓</span>}
            </div>
          )
        )}
      </div>
    </>
  );
}
