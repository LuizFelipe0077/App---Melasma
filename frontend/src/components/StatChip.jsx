export default function StatChip({ label, value, tone = 'ink' }) {
  const color = { ink: 'var(--ink)', success: 'var(--success)', warning: 'var(--warning)', danger: 'var(--danger)' }[tone];
  return (
    <div className="surface surface-pad">
      <div className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>{label}</div>
      <div className="display-sm" style={{ color }}>{value}</div>
    </div>
  );
}
