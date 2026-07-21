function buildCells(year, month, dayStatus) {
  const firstDay = new Date(year, month, 1);
  const leading = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: leading }, (_, i) => ({ empty: true, key: `b${i}` }));
  for (let day = 1; day <= daysInMonth; day++) {
    const key = new Date(year, month, day).toDateString();
    cells.push({ empty: false, day, key, status: dayStatus.get(key) });
  }
  return cells;
}

function cellClass(status) {
  if (!status) return '';
  if (status.missed > 0 && status.completed === 0) return 'missed';
  if (status.completed > 0 && status.missed === 0) return 'completed';
  if (status.completed > 0 || status.missed > 0) return 'partial';
  return '';
}

export default function HeatmapMonth({ year, month, dayStatus }) {
  const cells = buildCells(year, month, dayStatus);

  return (
    <div className="heatmap-month-grid">
      {cells.map((cell) =>
        cell.empty ? (
          <div key={cell.key} className="heatmap-month-cell empty" />
        ) : (
          <div key={cell.key} className={`heatmap-month-cell ${cellClass(cell.status)}`}>
            {cell.day}
          </div>
        )
      )}
    </div>
  );
}
