function adherenceTone(rate) {
  if (rate >= 90) return { tone: 'chip-success', label: 'Excelente' };
  if (rate < 60) return { tone: 'chip-danger', label: 'Alerta' };
  return { tone: 'chip-warning', label: 'Regular' };
}

export default function PatientTable({ patients, onRowClick, onReleaseClick, onHistoryClick }) {
  if (patients.length === 0) {
    return <p className="empty-state">Nenhum paciente encontrado.</p>;
  }

  return (
    <div>
      {patients.map((p) => {
        const { tone, label } = adherenceTone(p.rate);
        return (
          <div
            key={p.id}
            className="roster-row"
            role="button"
            tabIndex={0}
            aria-label={`Gerenciar ${p.nome}`}
            onClick={() => onRowClick(p)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(p); } }}
          >
            <div>
              <div className="dose-name">{p.nome}</div>
              <div className="dose-meta">{p.email}</div>
              {p.protocoloNome && <span className="chip chip-neutral" style={{ marginTop: 'var(--space-2)' }}>{p.protocoloNome}</span>}
            </div>
            <div className="roster-row-meta">
              <div className="flex items-center gap-3">
                <span style={{ fontWeight: 'var(--weight-semibold)' }}>{p.rate}%</span>
                <span className={`chip ${tone}`}>{label}</span>
              </div>
              <div className="roster-row-buttons">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); onHistoryClick(p); }}
                >
                  Histórico
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); onReleaseClick(p.id); }}
                >
                  Liberar retroativo
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
