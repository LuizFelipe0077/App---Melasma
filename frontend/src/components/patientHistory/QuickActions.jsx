function waLink(telefone, text) {
  const digits = (telefone || '').replace(/\D/g, '');
  const number = digits.startsWith('55') ? digits : `55${digits}`;
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export default function QuickActions({ patient, onEdit, onRelease, onAddNote }) {
  const reminderText = `Olá ${patient.nome.split(' ')[0]}! Passando para lembrar de manter os check-ins do seu tratamento em dia. Qualquer dúvida, estamos por aqui. 🙂`;

  return (
    <div className="quick-actions no-print">
      <a className="btn btn-ghost btn-sm" href={waLink(patient.telefone)} target="_blank" rel="noreferrer">💬 WhatsApp</a>
      <button className="btn btn-ghost btn-sm" onClick={onEdit}>✎ Editar paciente</button>
      <button className="btn btn-ghost btn-sm" onClick={onRelease}>🔓 Liberar edição</button>
      <button className="btn btn-ghost btn-sm" onClick={onAddNote}>📝 Adicionar observação</button>
      <a className="btn btn-ghost btn-sm" href={waLink(patient.telefone, reminderText)} target="_blank" rel="noreferrer">🔔 Enviar lembrete</a>
    </div>
  );
}
