import { useEffect, useState } from 'react';
import { ApiClient } from '../../api/apiClient.js';
import { useToast } from '../../context/ToastContext.jsx';

export const OBSERVACAO_TIPOS = [
  { value: 'OBSERVACAO', label: 'Observação' },
  { value: 'REACAO', label: 'Reação' },
  { value: 'MUDANCA', label: 'Mudança' },
  { value: 'SOLICITACAO', label: 'Solicitação' },
  { value: 'RETORNO', label: 'Retorno' }
];

export const INTERVENCAO_TIPOS = [
  { value: 'CONTATO', label: 'Contato' },
  { value: 'MUDANCA_PROTOCOLO', label: 'Mudança de protocolo' },
  { value: 'ORIENTACAO', label: 'Orientação' },
  { value: 'FEEDBACK', label: 'Feedback' }
];

/**
 * @param {string[]} [filterTipos] Only list notes whose tipo is in this set (defaults to OBSERVACAO_TIPOS' values).
 * @param {{value,label}[]} [tipoOptions] Options offered in the new-note form (defaults to OBSERVACAO_TIPOS).
 */
export default function ClinicalNotes({ pacienteId, filterTipos, tipoOptions = OBSERVACAO_TIPOS, emptyLabel = 'Nenhuma observação registrada ainda.' }) {
  const { showError, showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState(tipoOptions[0].value);
  const [saving, setSaving] = useState(false);

  const allLabels = [...OBSERVACAO_TIPOS, ...INTERVENCAO_TIPOS];
  const effectiveFilter = filterTipos || tipoOptions.map((t) => t.value);

  const load = async () => {
    setLoading(true);
    try {
      const all = await ApiClient.call('listarObservacoesClinicas', { pacienteId });
      setNotes(all.filter((n) => effectiveFilter.includes(n.tipo)));
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
      showToast({ message: 'Registro salvo.' });
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
            {tipoOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Nota</label>
          <textarea className="field-input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Registre os detalhes aqui..." />
        </div>
        <button type="submit" className="btn btn-fill" disabled={saving || !texto.trim()}>
          {saving ? <span className="spinner" /> : 'Registrar'}
        </button>
      </form>

      {loading ? (
        <div className="skeleton" style={{ height: 60 }} />
      ) : notes.length === 0 ? (
        <p className="empty-state">{emptyLabel}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((n) => (
            <div key={n.id} className="note-card">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <span className="note-type-tag">{allLabels.find((t) => t.value === n.tipo)?.label || n.tipo}</span>
                <span className="dose-meta">{new Date(n.createdAt).toLocaleString('pt-BR')}</span>
              </div>
              <p className="body-sm text-ink">{n.texto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
