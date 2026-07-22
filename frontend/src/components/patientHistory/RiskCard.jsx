const CLASS_STYLE = {
  'Muito Baixo': { bg: 'var(--success-wash)', fg: 'var(--success)' },
  'Baixo': { bg: 'var(--success-wash)', fg: 'var(--success)' },
  'Moderado': { bg: 'var(--warning-wash)', fg: 'var(--warning)' },
  'Alto': { bg: 'var(--danger-wash)', fg: 'var(--danger)' },
  'Crítico': { bg: 'var(--danger-wash)', fg: 'var(--danger-fill)' }
};

export default function RiskCard({ risk }) {
  const style = CLASS_STYLE[risk.classification] || CLASS_STYLE['Moderado'];

  return (
    <div className="surface surface-pad">
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="display-sm">Risco de Baixa Adesão</h2>
        <span className="risk-badge" style={{ backgroundColor: style.bg, color: style.fg }}>{risk.classification}</span>
      </div>
      <div className="flex flex-col gap-2">
        {risk.factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="body-sm">{f.label}</span>
            <span className="dose-meta">{f.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
