/**
 * Pure month-grid geometry (leading blank cells for a Monday-first week,
 * day count via `new Date(y, m+1, 0)`) — shared by HeatmapMonth.jsx (adds
 * historical check-in status per cell) and SupplementDatePicker.jsx (adds
 * schedule-active/selected state per cell). No coupling to either
 * consumer's own per-day data.
 */
export function buildMonthCells(year, month) {
  const firstDay = new Date(year, month, 1);
  const leading = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array.from({ length: leading }, (_, i) => ({ empty: true, key: `b${i}` }));
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({ empty: false, day, date, key: date.toDateString() });
  }
  return cells;
}

export function shiftMonth({ year, month }, delta) {
  const next = new Date(year, month + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() };
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
