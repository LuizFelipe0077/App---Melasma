import { useState } from 'react';
import Modal from './Modal.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const REPEAT_OPTIONS = [
  { value: 'todos', label: 'Todos os dias' },
  { value: 'dias_alternados', label: 'Dias alternados' },
  { value: 'finais_de_semana', label: 'Finais de semana' },
  { value: 'Seg,Qua,Sex', label: 'Segunda, Quarta e Sexta' },
  { value: 'Ter,Qui', label: 'Terça e Quinta' }
];

const NOTIF_OPTIONS = [
  { value: 'no_horario', label: 'No horário exato' },
  { value: '5min_antes', label: '5 minutos antes' },
  { value: '15min_antes', label: '15 minutos antes' },
  { value: '30min_antes', label: '30 minutos antes' },
  { value: '5min_depois', label: '5 minutos depois' }
];

const emptyPersonal = { nome: '', email: '', telefone: '', senha: '', observacoes: '' };
const emptyProtocol = { protocoloNome: 'Melasma', dataInicio: '', dataFim: '' };
const emptySupplementDraft = { nome: '', dosagem: '', quantidade: 1, tipo: 'Manipulado', horariosRaw: '', rep: 'todos', instrucoes: '' };

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
      const ok = await confirm({
        title: 'Cancelar cadastro',
        description: 'Todos os dados inseridos serão descartados.',
        confirmLabel: 'Descartar',
        danger: true
      });
      if (!ok) return;
    }
    resetAll();
    onClose();
  };

  const addSupplement = () => {
    if (!draft.nome.trim() || !draft.dosagem.trim() || !draft.horariosRaw.trim()) {
      showError('Preencha Nome, Dosagem e Horários para adicionar.');
      return;
    }
    const horarios = draft.horariosRaw.split(',').map((h) => h.trim()).filter((h) => TIME_REGEX.test(h));
    if (horarios.length === 0) {
      showError('Horários inválidos. Use formato HH:MM (ex: 08:00, 20:00).');
      return;
    }
    const diasSemana = draft.rep === 'todos' ? ['todos'] : draft.rep.split(',');
    setSupplements((prev) => [...prev, {
      nome: draft.nome.trim(),
      dosagem: draft.dosagem.trim(),
      quantidade: Number(draft.quantidade) || 1,
      tipo: draft.tipo,
      horarios,
      diasSemana,
      instrucoes: draft.instrucoes.trim(),
      notificacao: 'no_horario'
    }]);
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
      if (!protocol.dataInicio || !protocol.dataFim) {
        showError('Selecione as datas de início e fim do tratamento.');
        return;
      }
      if (new Date(protocol.dataFim) < new Date(protocol.dataInicio)) {
        showError('A data de fim não pode ser anterior à data de início.');
        return;
      }
    } else if (step === 3 && supplements.length === 0) {
      showError('Adicione pelo menos um suplemento ao tratamento do paciente.');
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
    <Modal open={open} onClose={handleClose} wide>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-h1 text-xl">Cadastrar Novo Paciente (Etapa {step}/5)</h3>
        <span className="wizard-progress-badge">{step * 20}%</span>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 text-secondary">Etapa 1: Dados Pessoais &amp; Acesso</h4>
            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <input className="form-input" placeholder="Ex: Mariana Costa" value={personal.nome} onChange={(e) => setPersonal({ ...personal, nome: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail (Login)</label>
              <input type="email" className="form-input" placeholder="Ex: mariana@email.com" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input type="tel" className="form-input" placeholder="Ex: (11) 99999-9999" value={personal.telefone} onChange={(e) => setPersonal({ ...personal, telefone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Senha de Acesso (Manual)</label>
              <input type="password" className="form-input" placeholder="Ex: Maria@2026" value={personal.senha} onChange={(e) => setPersonal({ ...personal, senha: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Observações Administrativas (Opcional)</label>
              <textarea className="form-input" style={{ minHeight: 80 }} value={personal.observacoes} onChange={(e) => setPersonal({ ...personal, observacoes: e.target.value })} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 text-secondary">Etapa 2: Escolha do Protocolo Clínico</h4>
            <div className="form-group">
              <label className="form-label">Protocolo Base</label>
              <select className="form-input" value={protocol.protocoloNome} onChange={(e) => setProtocol({ ...protocol, protocoloNome: e.target.value })}>
                <option value="Melasma">MELASMA (Identidade Luxuosa Terracota)</option>
                <option value="Desinflamação">DESINFLAMAÇÃO (Identidade Herbal Wellness)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Início do Tratamento</label>
                <input type="date" className="form-input" value={protocol.dataInicio} onChange={(e) => setProtocol({ ...protocol, dataInicio: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Fim (Previsão)</label>
                <input type="date" className="form-input" value={protocol.dataFim} onChange={(e) => setProtocol({ ...protocol, dataFim: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 text-secondary">Etapa 3: Prescrever Suplementos Customizados</h4>
            <div className="wizard-subform">
              <h5 className="font-semibold text-xs mb-2">Prescrever Novo Item</h5>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="form-group m-0">
                  <label className="form-label">Nome do Suplemento</label>
                  <input className="form-input" placeholder="Ex: Vitamina C" value={draft.nome} onChange={(e) => setDraft({ ...draft, nome: e.target.value })} />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">Dosagem</label>
                  <input className="form-input" placeholder="Ex: 500mg (1 cápsula)" value={draft.dosagem} onChange={(e) => setDraft({ ...draft, dosagem: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="form-group m-0">
                  <label className="form-label">Quantidade Prescrita</label>
                  <input type="number" min="1" className="form-input" value={draft.quantidade} onChange={(e) => setDraft({ ...draft, quantidade: e.target.value })} />
                </div>
                <div className="form-group m-0">
                  <label className="form-label">Tipo</label>
                  <select className="form-input" value={draft.tipo} onChange={(e) => setDraft({ ...draft, tipo: e.target.value })}>
                    {['Manipulado', 'Industrializado', 'Fitoterápico', 'Vitamina', 'Mineral', 'Outro'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Horários (separados por vírgula)</label>
                <input className="form-input" placeholder="Ex: 08:00, 13:00, 22:00" value={draft.horariosRaw} onChange={(e) => setDraft({ ...draft, horariosRaw: e.target.value })} />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Regra de Repetição</label>
                <select className="form-input" value={draft.rep} onChange={(e) => setDraft({ ...draft, rep: e.target.value })}>
                  {REPEAT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="form-group mb-3">
                <label className="form-label">Instruções de Uso</label>
                <input className="form-input" placeholder="Ex: Tomar com estômago cheio" value={draft.instrucoes} onChange={(e) => setDraft({ ...draft, instrucoes: e.target.value })} />
              </div>
              <button type="button" className="btn btn-primary w-full" onClick={addSupplement}>➕ Adicionar Item à Prescrição</button>
            </div>

            <div style={{ border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface-hover)' }}>
              <h5 className="font-semibold text-xs mb-2">Itens Prescritos nesta Sessão:</h5>
              {supplements.length === 0 ? (
                <p className="text-xs text-tertiary text-center" style={{ padding: '8px 0' }}>Nenhum suplemento adicionado ainda.</p>
              ) : (
                supplements.map((s, idx) => (
                  <div className="wizard-item-row animate-fade-in" key={idx}>
                    <div>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{s.nome}</strong> - {s.dosagem} ({s.quantidade} cáps)<br />
                      <span className="text-secondary">Horários: {s.horarios.join(', ')} | Repetição: {s.diasSemana.join(', ')}</span>
                    </div>
                    <button type="button" className="btn btn-ghost-danger btn-sm" onClick={() => removeSupplement(idx)}>Excluir</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 text-secondary">Etapa 4: Agendamento &amp; Notificações</h4>
            <p className="text-xs text-tertiary mb-4">Escolha a regra de aviso no celular do paciente para as doses:</p>
            <div className="flex flex-col gap-3">
              {supplements.map((s, idx) => (
                <div key={idx} className="wizard-item-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.nome} ({s.dosagem})</span>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="form-label m-0" style={{ fontSize: 11 }}>Notificação:</label>
                    <select
                      className="form-input"
                      style={{ padding: '6px 12px', flex: 1 }}
                      value={s.notificacao}
                      onChange={(e) => {
                        const updated = [...supplements];
                        updated[idx] = { ...s, notificacao: e.target.value };
                        setSupplements(updated);
                      }}
                    >
                      {NOTIF_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h4 className="font-semibold text-sm mb-3 text-secondary">Etapa 5: Confirmar Dados e Finalizar</h4>
            <div style={{ border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface-hover)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              <div className="mb-3">
                <strong style={{ color: 'var(--color-text-primary)' }}>Paciente:</strong> {personal.nome || '--'}<br />
                <strong style={{ color: 'var(--color-text-primary)' }}>Acesso:</strong> {personal.email || '--'} ({personal.telefone || '--'})<br />
                <strong style={{ color: 'var(--color-text-primary)' }}>Protocolo:</strong> {protocol.protocoloNome} ({protocol.dataInicio || '--'} a {protocol.dataFim || '--'})
              </div>
              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 12 }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Suplementos Prescritos:</strong>
                <ul style={{ listStyle: 'disc', paddingLeft: 20, marginTop: 4 }}>
                  {supplements.length === 0
                    ? <li>Nenhum item adicionado.</li>
                    : supplements.map((s, idx) => (
                        <li key={idx}><strong>{s.nome}</strong>: {s.dosagem} ({s.quantidade} cáps) nos horários [{s.horarios.join(', ')}] [Repetição: {s.diasSemana.join(', ')}]</li>
                      ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-between mt-6">
          {step > 1 ? <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>Voltar</button> : <span />}
          <div className="flex gap-2">
            <button type="button" className="btn btn-outline" onClick={handleClose}>Cancelar</button>
            {step < 5
              ? <button type="button" className="btn btn-primary" onClick={goNext}>Avançar</button>
              : <button type="submit" className="btn btn-success" disabled={submitting}>{submitting ? 'Salvando...' : 'Confirmar e Salvar'}</button>}
          </div>
        </div>
      </form>
    </Modal>
  );
}
