import { useEffect, useState } from 'react';
import { ApiClient } from '../../api/apiClient.js';
import { useToast } from '../../context/ToastContext.jsx';

const TIPO_OPTIONS = [
  { value: 'OBSERVACAO', label: 'Observação' },
  { value: 'REACAO', label: 'Reação' },
  { value: 'MUDANCA', label: 'Mudança' },
  { value: 'SOLICITACAO', label: 'Solicitação' },
  { value: 'RETORNO', label: 'Retorno' }
];

export default function ClinicalNotes({ pacienteId }) {
  const { showError, showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('OBSERVACAO');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setNotes(await ApiClient.call('listarObservacoesClinicas', { pacienteId }));
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setSaving(true);
    try {
      await ApiClient.call('criarObservacaoClinica', { pacienteId, texto, tipo });
      setTexto('');
      showToast({ message: 'Observação registrada.' });
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="body-sm no-print" style={{ marginBottom: 'var(--space-4)' }}>
        🔒 Visível apenas para a equipe clínica — nunca exibido ao paciente.
      </p>

      <form onSubmit={handleSubmit} className="no-print" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="field">
          <label className="field-label">Tipo</label>
          <select className="field-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPO_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Nota</label>
          <textarea className="field-input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Registre uma observação, reação, mudança, solicitação ou retorno..." />
        </div>
        <button type="submit" className="btn btn-fill" disabled={saving || !texto.trim()}>
          {saving ? <span className="spinner" /> : 'Registrar'}
        </button>
      </form>

      {loading ? (
        <div className="skeleton" style={{ height: 60 }} />
      ) : notes.length === 0 ? (
        <p className="empty-state">Nenhuma observação registrada ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((n) => (
            <div key={n.id} className="note-card">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <span className="note-type-tag">{TIPO_OPTIONS.find((t) => t.value === n.tipo)?.label || n.tipo}</span>
                <span className="dose-meta">{new Date(n.createdAt).toLocaleString('pt-BR')}</span>
              </div>
              <p className="body-sm" style={{ color: 'var(--ink)' }}>{n.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
