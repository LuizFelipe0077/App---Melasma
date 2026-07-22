export default function WeeklyEvolution({ weeks }) {
  if (weeks.length === 0) {
    return <p className="empty-state">Sem semanas completas ainda.</p>;
  }

  return (
    <div className="heatmap-strip">
      {weeks.map((w) => (
        <div key={w.weekNumber} className="surface metric-card" style={{ minWidth: 120, flexShrink: 0, textAlign: 'center' }}>
          <div className="eyebrow">Semana {w.weekNumber}</div>
          <div className="metric-value" style={{ marginTop: 'var(--space-2)' }}>{w.rate}%</div>
        </div>
      ))}
    </div>
  );
}
