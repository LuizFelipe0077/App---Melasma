export default function StatChip({ label, value, tone = 'ink' }) {
  const color = { ink: 'var(--ink)', success: 'var(--success)', danger: 'var(--danger)' }[tone];
  return (
    <div className="surface surface-pad" style={{ flex: 1 }}>
      <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>{label}</div>
      <div className="display-sm" style={{ color }}>{value}</div>
    </div>
  );
}
