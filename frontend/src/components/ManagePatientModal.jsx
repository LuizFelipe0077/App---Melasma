import { useEffect, useState } from 'react';
import ManageSupplements from './ManageSupplements.jsx';
import Sheet from './Sheet.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';

const emptyForm = { id: '', nome: '', email: '', telefone: '', dataInicio: '', dataFim: '', status: 'ATIVO', novaSenha: '' };

export default function ManagePatientModal({ open, patient, onClose, onSave, onDelete }) {
  const confirm = useConfirm();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({ id: patient.id, nome: patient.nome, email: patient.email, telefone: patient.telefone, dataInicio: patient.dataInicio, dataFim: patient.dataFim, status: patient.status, novaSenha: '' });
    }
  }, [patient]);

  const handleClose = async () => {
    const ok = await confirm({ title: 'Descartar alterações', description: 'Suas edições não salvas serão perdidas.', confirmLabel: 'Descartar', danger: true });
    if (ok) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        pacienteId: form.id, nome: form.nome, email: form.email, telefone: form.telefone, status: form.status,
        dataInicio: new Date(form.dataInicio).toISOString(), dataFim: new Date(form.dataFim).toISOString(),
        senha: form.novaSenha || null
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({ title: 'Excluir paciente', description: `Excluir permanentemente a conta de ${form.nome}?`, confirmLabel: 'Excluir', danger: true });
    if (ok) onDelete(form.id);
  };

  if (!patient) return null;

  return (
    <Sheet open={open} onClose={handleClose} title="Gerenciar paciente">
      <form onSubmit={handleSubmit}>
        <div className="field"><label className="field-label">Nome</label><input className="field-input" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
        <div className="field"><label className="field-label">E-mail</label><input type="email" className="field-input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label className="field-label">WhatsApp</label><input type="tel" className="field-input" required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
        <div className="flex gap-3">
          <div className="field" style={{ flex: 1 }}><label className="field-label">Início</label><input type="date" className="field-input" required value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} /></div>
          <div className="field" style={{ flex: 1 }}><label className="field-label">Fim</label><input type="date" className="field-input" required value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} /></div>
        </div>
        <div className="field">
          <label className="field-label">Status</label>
          <select className="field-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
        <div className="field">
          <label className="field-label">Nova senha (opcional)</label>
          <input type="password" className="field-input" placeholder="Deixe em branco para manter" value={form.novaSenha} onChange={(e) => setForm({ ...form, novaSenha: e.target.value })} />
        </div>

        <div className="flex justify-between" style={{ marginTop: 'var(--space-5)' }}>
          <button type="button" className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={handleDelete}>Excluir conta</button>
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="btn btn-fill" disabled={saving}>{saving ? <span className="spinner" /> : 'Salvar'}</button>
          </div>
        </div>
      </form>

      <ManageSupplements pacienteId={form.id} />
    </Sheet>
  );
}
