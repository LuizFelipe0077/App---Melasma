import Badge from './Badge.jsx';

function adherenceTone(rate) {
  if (rate >= 90) return { tone: 'success', label: 'Excelente' };
  if (rate < 60) return { tone: 'danger', label: 'Alerta' };
  return { tone: 'warning', label: 'Regular' };
}

export default function PatientTable({ patients, onRowClick, onReleaseClick }) {
  if (patients.length === 0) {
    return <p className="text-xs text-tertiary text-center" style={{ padding: '24px 0' }}>Nenhum paciente encontrado.</p>;
  }

  return (
    <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
      <table>
        <thead>
          <tr>
            <th>Paciente / Contato</th>
            <th>Taxa de Adesão</th>
            <th style={{ textAlign: 'right' }}>Ações de Controle</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => {
            const { tone, label } = adherenceTone(p.rate);
            return (
              <tr key={p.id} onClick={() => onRowClick(p)}>
                <td>
                  <div style={{ fontWeight: 500 }}>{p.nome}</div>
                  <div className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>{p.email}</div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.rate}%</span>
                    <Badge tone={tone}>{label}</Badge>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReleaseClick(p.id);
                    }}
                  >
                    Liberar Retroativo
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
