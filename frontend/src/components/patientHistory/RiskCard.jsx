const CLASS_TONE = {
  'Muito Baixo': 'success',
  'Baixo': 'success',
  'Moderado': 'warning',
  'Alto': 'danger',
  'Crítico': 'danger'
};

export default function RiskCard({ risk }) {
  const tone = CLASS_TONE[risk.classification] || 'warning';

  return (
    <div className="surface surface-pad">
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-4)' }}>
        <h2 className="display-sm">Risco de Baixa Adesão</h2>
        <span className={`risk-badge risk-badge--${tone}`}>{risk.classification}</span>
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
