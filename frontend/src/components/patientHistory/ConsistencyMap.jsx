function colorFor(rate) {
  if (rate === null) return 'var(--surface-sunken)';
  if (rate >= 80) return 'var(--success)';
  if (rate >= 50) return 'var(--warning)';
  return 'var(--danger-fill)';
}

export default function ConsistencyMap({ map }) {
  return (
    <div className="surface surface-pad">
      <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Mapa de Consistência</h2>
      {map.periods.map((p) => (
        <div className="consistency-row" key={p.key}>
          <span className="consistency-label">{p.label}</span>
          <span className="consistency-track">
            <span className="consistency-fill" style={{ width: `${p.rate ?? 0}%`, backgroundColor: colorFor(p.rate) }} />
          </span>
          <span className="consistency-value">{p.rate === null ? '—' : `${p.rate}%`}</span>
        </div>
      ))}
      {map.worst && (
        <p className="body-sm" style={{ marginTop: 'var(--space-3)' }}>
          Maior dificuldade no período da <strong style={{ color: 'var(--ink)' }}>{map.worst.label.toLowerCase()}</strong> ({map.worst.rate}% de adesão).
        </p>
      )}
    </div>
  );
}
