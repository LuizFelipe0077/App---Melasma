import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';

const emptyForm = { id: '', nome: '', email: '', telefone: '', dataInicio: '', dataFim: '', status: 'ATIVO', novaSenha: '' };

export default function ManagePatientModal({ open, patient, onClose, onSave, onDelete }) {
  const confirm = useConfirm();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({
        id: patient.id,
        nome: patient.nome,
        email: patient.email,
        telefone: patient.telefone,
        dataInicio: patient.dataInicio,
        dataFim: patient.dataFim,
        status: patient.status,
        novaSenha: ''
      });
    }
  }, [patient]);

  const handleClose = async () => {
    const ok = await confirm({ title: 'Descartar alterações', description: 'Deseja descartar as alterações não salvas da edição do paciente?', confirmLabel: 'Descartar', danger: true });
    if (ok) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        pacienteId: form.id,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        status: form.status,
        dataInicio: new Date(form.dataInicio).toISOString(),
        dataFim: new Date(form.dataFim).toISOString(),
        senha: form.novaSenha || null
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Excluir paciente',
      description: `Tem certeza absoluta que deseja excluir permanentemente a conta de ${form.nome}?`,
      confirmLabel: 'Excluir definitivamente',
      danger: true
    });
    if (ok) onDelete(form.id);
  };

  if (!patient) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Gerenciar Paciente" description="Visualize, edite ou gerencie as informações da conta do paciente.">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nome Completo</label>
          <input className="form-input" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">E-mail (Login)</label>
          <input type="email" className="form-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">WhatsApp</label>
          <input type="tel" className="form-input" required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Início do Protocolo</label>
            <input type="date" className="form-input" required value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Fim (Previsão)</label>
            <input type="date" className="form-input" required value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Status da Conta</label>
          <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ATIVO">ATIVO (Acesso liberado)</option>
            <option value="INATIVO">INATIVO (Acesso bloqueado)</option>
          </select>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 16, marginTop: 16 }}>
          <h4 className="text-base font-semibold mb-2">🔑 Segurança &amp; Senha</h4>
          <div className="form-group">
            <label className="form-label">Definir Nova Senha (Opcional)</label>
            <input type="password" className="form-input" placeholder="Digite apenas se quiser alterar a senha" value={form.novaSenha} onChange={(e) => setForm({ ...form, novaSenha: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-3 justify-between mt-6">
          <button type="button" className="btn btn-ghost-danger" onClick={handleDelete}>Excluir Conta</button>
          <div className="flex gap-2">
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
