import { useConfirm } from '../../context/ConfirmContext.jsx';

function waLink(telefone, text) {
  const digits = (telefone || '').replace(/\D/g, '');
  const number = digits.startsWith('55') ? digits : `55${digits}`;
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export default function QuickActions({ patient, onEdit, onRelease, onAddNote }) {
  const confirm = useConfirm();
  const firstName = patient.nome.split(' ')[0];
  const reminderText = `Olá ${firstName}! Passando para lembrar de manter os check-ins do seu tratamento em dia. Qualquer dúvida, estamos por aqui. 🙂`;

  const withConfirm = (title, description, confirmLabel, action) => async () => {
    const ok = await confirm({ title, description, confirmLabel });
    if (ok) action();
  };

  const handleWhatsapp = withConfirm(
    'Abrir WhatsApp',
    `Abrir uma conversa no WhatsApp com ${firstName}?`,
    'Abrir',
    () => window.open(waLink(patient.telefone), '_blank', 'noreferrer')
  );
  const handleEdit = withConfirm('Editar paciente', `Abrir a edição do cadastro de ${firstName}?`, 'Editar', onEdit);
  const handleRelease = withConfirm('Liberar edição retroativa', `Abrir a liberação de check-ins retroativos para ${firstName}?`, 'Liberar', onRelease);
  const handleAddNote = withConfirm('Adicionar observação', `Abrir o formulário de observação clínica para ${firstName}?`, 'Adicionar', onAddNote);
  const handleReminder = withConfirm(
    'Enviar lembrete',
    `Abrir o WhatsApp com uma mensagem de lembrete pronta para ${firstName}?`,
    'Abrir',
    () => window.open(waLink(patient.telefone, reminderText), '_blank', 'noreferrer')
  );

  return (
    <div className="quick-actions quick-actions--column no-print">
      <button className="btn btn-ghost quick-action-btn" onClick={handleWhatsapp}>💬 WhatsApp</button>
      <button className="btn btn-ghost quick-action-btn" onClick={handleEdit}>✎ Editar paciente</button>
      <button className="btn btn-ghost quick-action-btn" onClick={handleRelease}>🔓 Liberar edição</button>
      <button className="btn btn-ghost quick-action-btn" onClick={handleAddNote}>📝 Adicionar observação</button>
      <button className="btn btn-ghost quick-action-btn" onClick={handleReminder}>🔔 Enviar lembrete</button>
    </div>
  );
}
