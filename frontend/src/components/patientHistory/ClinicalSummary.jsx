function formatRange(start, end) {
  const opts = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString('pt-BR', opts)} – ${end.toLocaleDateString('pt-BR', opts)}`;
}

export default function ClinicalSummary({ summary }) {
  const items = [
    { label: 'Dias perfeitos', value: summary.diasPerfeitos },
    { label: 'Maior sequência', value: `${summary.maiorSequencia} dias` },
    { label: 'Suplemento mais negligenciado', value: summary.suplementoNegligenciado ? `${summary.suplementoNegligenciado.nome} (${summary.suplementoNegligenciado.taxaAdesao}%)` : '—' },
    { label: 'Melhor horário de adesão', value: summary.melhorHorario ? `${summary.melhorHorario.label} (${summary.melhorHorario.rate}%)` : '—' },
    { label: 'Período de maior consistência', value: summary.periodoMaiorConsistencia ? `${formatRange(summary.periodoMaiorConsistencia.start, summary.periodoMaiorConsistencia.end)} (${summary.periodoMaiorConsistencia.rate}%)` : '—' },
    { label: 'Período de maior dificuldade', value: summary.periodoMaiorDificuldade ? `${formatRange(summary.periodoMaiorDificuldade.start, summary.periodoMaiorDificuldade.end)} (${summary.periodoMaiorDificuldade.rate}%)` : '—' }
  ];

  return (
    <div className="surface surface-pad">
      <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Resumo Clínico</h2>
      <div className="summary-grid">
        {items.map((it) => (
          <div key={it.label}>
            <div className="summary-item-label">{it.label}</div>
            <div className="summary-item-value">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
