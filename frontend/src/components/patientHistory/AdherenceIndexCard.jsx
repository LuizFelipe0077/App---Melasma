import AdherenceGauge from './AdherenceGauge.jsx';

export default function AdherenceIndexCard({ index }) {
  return (
    <div className="surface surface-pad">
      <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Índice de Adesão</h2>
      <div className="flex items-center gap-6" style={{ flexWrap: 'wrap' }}>
        <div className="flex justify-center" style={{ flex: '0 0 auto' }}>
          <AdherenceGauge value={index.value} classification={index.classification} />
        </div>
        <div style={{ flex: '1 1 220px' }}>
          <p className="body-sm" style={{ marginBottom: 'var(--space-4)' }}>Composição da nota:</p>
          <div className="flex flex-col gap-3">
            {index.breakdown.map((b) => (
              <div className="index-breakdown-row" key={b.label}>
                <span className="index-breakdown-label">{b.label} <span style={{ color: 'var(--ink-faint)' }}>({b.weight}%)</span></span>
                <span className="index-breakdown-track"><span className="index-breakdown-fill" style={{ width: `${b.value}%` }} /></span>
                <span className="index-breakdown-value">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
