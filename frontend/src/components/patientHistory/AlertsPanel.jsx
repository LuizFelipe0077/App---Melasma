export default function AlertsPanel({ alerts }) {
  if (alerts.length === 0) {
    return <p className="empty-state">Nenhum alerta no momento — paciente em dia.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.map((a, idx) => (
        <div key={idx} className={`alert-card ${a.severity}`}>
          <span className="alert-icon" aria-hidden="true">{a.icon}</span>
          <span className="body-sm" style={{ color: 'var(--ink)' }}>{a.text}</span>
        </div>
      ))}
    </div>
  );
}
