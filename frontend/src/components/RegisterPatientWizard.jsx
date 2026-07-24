import { useState } from 'react';
import Sheet from './Sheet.jsx';
import SupplementFields, { emptySupplementDraft, parseSupplementDraft } from './SupplementFields.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const NOTIF_OPTIONS = [
  { value: 'no_horario', label: 'No horário exato' },
  { value: '5min_antes', label: '5 minutos antes' },
  { value: '15min_antes', label: '15 minutos antes' },
  { value: '30min_antes', label: '30 minutos antes' },
  { value: '5min_depois', label: '5 minutos depois' }
];

const emptyPersonal = { nome: '', email: '', telefone: '', senha: '', observacoes: '' };
const emptyProtocol = { protocoloNome: 'Melasma', dataInicio: '', dataFim: '' };

export default function RegisterPatientWizard({ open, onClose, onSubmit }) {
  const { showError } = useToast();
  const confirm = useConfirm();

  const [step, setStep] = useState(1);
  const [personal, setPersonal] = useState(emptyPersonal);
  const [protocol, setProtocol] = useState(emptyProtocol);
  const [supplements, setSupplements] = useState([]);
  const [draft, setDraft] = useState(emptySupplementDraft);
  const [submitting, setSubmitting] = useState(false);

  const resetAll = () => {
    setStep(1);
    setPersonal(emptyPersonal);
    setProtocol(emptyProtocol);
    setSupplements([]);
    setDraft(emptySupplementDraft);
  };

  const handleClose = async () => {
    const dirty = step > 1 || personal.nome.trim().length > 0;
    if (dirty) {
      const ok = await confirm({ title: 'Descartar cadastro', description: 'Todos os dados inseridos serão perdidos.', confirmLabel: 'Descartar', danger: true });
      if (!ok) return;
    }
    resetAll();
    onClose();
  };

  const addSupplement = () => {
    const parsed = parseSupplementDraft(draft, showError);
    if (!parsed) return;
    setSupplements((prev) => [...prev, { ...parsed, notificacao: 'no_horario' }]);
    setDraft(emptySupplementDraft);
  };

  const removeSupplement = (idx) => setSupplements((prev) => prev.filter((_, i) => i !== idx));

  const goNext = () => {
    if (step === 1) {
      if (!personal.nome.trim() || !personal.email.trim() || !personal.telefone.trim() || !personal.senha.trim()) {
        showError('Preencha todos os dados pessoais e de acesso.');
        return;
      }
    } else if (step === 2) {
      if (!protocol.dataInicio || !protocol.dataFim) { showError('Selecione as datas do tratamento.'); return; }
      if (new Date(protocol.dataFim) < new Date(protocol.dataInicio)) { showError('A data de fim não pode ser anterior à de início.'); return; }
    } else if (step === 3 && supplements.length === 0) {
      showError('Adicione pelo menos um suplemento.');
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        nome: personal.nome,
        email: personal.email,
        telefone: personal.telefone,
        senha: personal.senha,
        observacoes: personal.observacoes,
        protocoloNome: protocol.protocoloNome,
        dataInicio: new Date(protocol.dataInicio).toISOString(),
        dataFim: new Date(protocol.dataFim).toISOString(),
        suplementos: supplements
      });
      resetAll();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onClose={handleClose}>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)' }}>
        <h2 className="display-sm">Novo paciente</h2>
        <span className="eyebrow">Etapa {step}/5</span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="animate-in">
            <div className="field"><label className="field-label">Nome completo</label><input className="field-input" value={personal.nome} onChange={(e) => setPersonal({ ...personal, nome: e.target.value })} /></div>
            <div className="field"><label className="field-label">E-mail (login)</label><input type="email" className="field-input" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} /></div>
            <div className="field"><label className="field-label">WhatsApp</label><input type="tel" className="field-input" value={personal.telefone} onChange={(e) => setPersonal({ ...personal, telefone: e.target.value })} /></div>
            <div className="field"><label className="field-label">Senha de acesso</label><input type="password" className="field-input" value={personal.senha} onChange={(e) => setPersonal({ ...personal, senha: e.target.value })} /></div>
            <div className="field"><label className="field-label">Observações (opcional)</label><textarea className="field-input" value={personal.observacoes} onChange={(e) => setPersonal({ ...personal, observacoes: e.target.value })} /></div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in">
            <div className="field">
              <label className="field-label">Protocolo</label>
              <select className="field-input" value={protocol.protocoloNome} onChange={(e) => setProtocol({ ...protocol, protocoloNome: e.target.value })}>
                <option value="Melasma">Melasma</option>
                <option value="Desinflamação">Desinflamação</option>
              </select>
            </div>
            <div className="field-row">
              <div className="field"><label className="field-label">Início</label><input type="date" className="field-input" value={protocol.dataInicio} onChange={(e) => setProtocol({ ...protocol, dataInicio: e.target.value })} /></div>
              <div className="field"><label className="field-label">Fim</label><input type="date" className="field-input" value={protocol.dataFim} onChange={(e) => setProtocol({ ...protocol, dataFim: e.target.value })} /></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in">
            <div className="surface surface-pad" style={{ marginBottom: 'var(--space-4)' }}>
              <SupplementFields
                draft={draft}
                onChange={setDraft}
                dataInicio={protocol.dataInicio}
                dataFim={protocol.dataFim}
                protocoloNome={protocol.protocoloNome}
              />
              <button type="button" className="btn btn-fill w-full" onClick={addSupplement}>Adicionar item</button>
            </div>
            {supplements.length === 0 ? (
              <p className="body-sm">Nenhum suplemento adicionado ainda.</p>
            ) : (
              supplements.map((s, idx) => (
                <div key={idx} className="list-row">
                  <div>
                    <div className="dose-name">{s.nome} — {s.dosagem}</div>
                    <div className="dose-meta">{s.horarios.join(', ')}</div>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeSupplement(idx)}>Remover</button>
                </div>
              ))
            )}
          </div>
        )}

        {step === 4 && (
          <div className="animate-in flex flex-col gap-3">
            <p className="body-sm">Regra de notificação para cada dose:</p>
            {supplements.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3">
                <span className="dose-name">{s.nome}</span>
                <select
                  className="field-input" style={{ maxWidth: 200 }}
                  value={s.notificacao}
                  onChange={(e) => { const updated = [...supplements]; updated[idx] = { ...s, notificacao: e.target.value }; setSupplements(updated); }}
                >
                  {NOTIF_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="animate-in surface surface-pad">
            <p><strong>{personal.nome}</strong> · {personal.email}</p>
            <p className="body-sm">{protocol.protocoloNome} · {protocol.dataInicio} a {protocol.dataFim}</p>
            <ul style={{ marginTop: 'var(--space-3)', paddingLeft: 20 }}>
              {supplements.map((s, idx) => <li key={idx} className="body-sm">{s.nome} — {s.dosagem} ({s.horarios.join(', ')})</li>)}
            </ul>
          </div>
        )}

        <div className="flex justify-between" style={{ marginTop: 'var(--space-6)' }}>
          {step > 1 ? <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Voltar</button> : <span />}
          <div className="flex gap-2">
            <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancelar</button>
            {step < 5
              ? <button type="button" className="btn btn-fill" onClick={goNext}>Avançar</button>
              : <button type="submit" className="btn btn-fill" disabled={submitting}>{submitting ? <span className="spinner" /> : 'Confirmar'}</button>}
          </div>
        </div>
      </form>
    </Sheet>
  );
}
