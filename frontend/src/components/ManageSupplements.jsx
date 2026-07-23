import { useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import SupplementFields, { draftFromSuplemento, emptySupplementDraft, parseSupplementDraft } from './SupplementFields.jsx';

export default function ManageSupplements({ pacienteId }) {
  const { showError, showToast } = useToast();
  const confirm = useConfirm();

  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptySupplementDraft);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState(emptySupplementDraft);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    // Guards a real race: the parent modal syncs `patient` into its own form
    // state via an effect, which runs one render after `patient` first
    // becomes non-null — so on that first render `pacienteId` can still be
    // the empty default. Firing gerarDashboard with an empty id crashes the
    // backend's `new UUID(pacienteId)` with no friendly validation ahead of
    // it. Skipping here means the next render (once the real id lands)
    // re-triggers this effect and loads correctly, with no user-visible error.
    if (!pacienteId) return;
    setLoading(true);
    try {
      const today = new Date();
      const result = await ApiClient.call('gerarDashboard', {
        pacienteId,
        dataInicio: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toISOString(),
        dataFim: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()).toISOString()
      });
      setSupplements(result.historicoAgrupadoPorSuplemento || []);
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

  const startEdit = (sup) => {
    setEditingId(sup.suplementoId);
    setEditDraft(draftFromSuplemento(sup));
  };

  const saveEdit = async () => {
    const parsed = parseSupplementDraft(editDraft, showError);
    if (!parsed) return;
    setBusy(true);
    try {
      await ApiClient.call('editarSuplemento', { suplementoId: editingId, ...parsed });
      showToast({ message: 'Suplemento atualizado.' });
      setEditingId(null);
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const removeSupplement = async (sup) => {
    const ok = await confirm({ title: 'Remover suplemento', description: `Remover "${sup.nome}" do protocolo deste paciente?`, confirmLabel: 'Remover', danger: true });
    if (!ok) return;
    setBusy(true);
    try {
      await ApiClient.call('removerSuplemento', { suplementoId: sup.suplementoId });
      showToast({ message: 'Suplemento removido.' });
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const saveAdd = async () => {
    const parsed = parseSupplementDraft(addDraft, showError);
    if (!parsed) return;
    setBusy(true);
    try {
      await ApiClient.call('adicionarSuplemento', { pacienteId, ...parsed });
      showToast({ message: 'Suplemento adicionado.' });
      setAdding(false);
      setAddDraft(emptySupplementDraft);
      await load();
    } catch (err) {
      showError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ borderTop: 'var(--hairline) solid var(--line)', paddingTop: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-3)' }}>
        <h3 className="eyebrow">Suplementos</h3>
        {!adding && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding(true)}>+ Adicionar</button>}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 48 }} />
      ) : supplements.length === 0 && !adding ? (
        <p className="body-sm">Nenhum suplemento cadastrado.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {supplements.map((sup) =>
            editingId === sup.suplementoId ? (
              <div key={sup.suplementoId} className="surface surface-pad">
                <SupplementFields draft={editDraft} onChange={setEditDraft} />
                <div className="flex gap-2 justify-end">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => setEditingId(null)}>Cancelar</button>
                  <button type="button" className="btn btn-fill btn-sm" disabled={busy} onClick={saveEdit}>Salvar</button>
                </div>
              </div>
            ) : (
              <div key={sup.suplementoId} className="list-row">
                <div>
                  <div className="dose-name">{sup.nome} — {sup.dosagem}</div>
                  <div className="dose-meta">{(sup.horarios || []).join(', ')}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => startEdit(sup)}>Editar</button>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => removeSupplement(sup)}>Remover</button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {adding && (
        <div className="surface surface-pad" style={{ marginTop: 'var(--space-3)' }}>
          <SupplementFields draft={addDraft} onChange={setAddDraft} />
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => { setAdding(false); setAddDraft(emptySupplementDraft); }}>Cancelar</button>
            <button type="button" className="btn btn-fill btn-sm" disabled={busy} onClick={saveAdd}>Adicionar</button>
          </div>
        </div>
      )}
    </div>
  );
}
