const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function buildCells(year, month, days) {
  const firstDay = new Date(year, month, 1);
  const leading = (firstDay.getDay() + 6) % 7;
  const byDate = new Map(days.map((d) => [d.date.toDateString(), d]));
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: leading }, (_, i) => ({ empty: true, key: `b${i}` }));
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = date.toDateString();
    cells.push({ empty: false, day, key, record: byDate.get(key) });
  }
  return cells;
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
