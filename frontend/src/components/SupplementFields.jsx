const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const REPEAT_OPTIONS = [
  { value: 'todos', label: 'Todos os dias' },
  { value: 'dias_alternados', label: 'Dias alternados' },
  { value: 'finais_de_semana', label: 'Finais de semana' },
  { value: 'Seg,Qua,Sex', label: 'Segunda, Quarta e Sexta' },
  { value: 'Ter,Qui', label: 'Terça e Quinta' }
];

export const TIPO_OPTIONS = ['Manipulado', 'Industrializado', 'Fitoterápico', 'Vitamina', 'Mineral', 'Outro'];

export const emptySupplementDraft = { nome: '', dosagem: '', quantidade: 1, tipo: 'Manipulado', horariosRaw: '', rep: 'todos', instrucoes: '' };

export function draftFromSuplemento(sup) {
  return {
    nome: sup.nome || '',
    dosagem: sup.dosagem || '',
    quantidade: sup.quantidade ?? 1,
    tipo: sup.tipo || 'Manipulado',
    horariosRaw: (sup.horarios || []).join(', '),
    rep: Array.isArray(sup.diasSemana) ? sup.diasSemana.join(',') : 'todos',
    instrucoes: sup.instrucoes || ''
  };
}

/** Validates + normalizes a draft into the shape the backend expects. Returns null (and calls onError) if invalid. */
export function parseSupplementDraft(draft, onError) {
  if (!draft.nome.trim() || !draft.dosagem.trim() || !draft.horariosRaw.trim()) {
    onError('Preencha nome, dosagem e horários.');
    return null;
  }
  const horarios = draft.horariosRaw.split(',').map((h) => h.trim()).filter((h) => TIME_REGEX.test(h));
  if (horarios.length === 0) {
    onError('Horários inválidos — use o formato HH:MM (ex: 08:00, 20:00).');
    return null;
  }
  const diasSemana = draft.rep === 'todos' ? ['todos'] : draft.rep.split(',');
  return {
    nome: draft.nome.trim(),
    dosagem: draft.dosagem.trim(),
    quantidade: Number(draft.quantidade) || 1,
    tipo: draft.tipo,
    horarios,
    diasSemana,
    instrucoes: draft.instrucoes.trim()
  };
}

export default function SupplementFields({ draft, onChange }) {
  const set = (patch) => onChange({ ...draft, ...patch });

  return (
    <div>
      <div className="flex gap-3">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Nome</label>
          <input className="field-input" placeholder="Ex: Vitamina C" value={draft.nome} onChange={(e) => set({ nome: e.target.value })} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Dosagem</label>
          <input className="field-input" placeholder="Ex: 500mg" value={draft.dosagem} onChange={(e) => set({ dosagem: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Quantidade</label>
          <input type="number" min="1" className="field-input" value={draft.quantidade} onChange={(e) => set({ quantidade: e.target.value })} />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label className="field-label">Tipo</label>
          <select className="field-input" value={draft.tipo} onChange={(e) => set({ tipo: e.target.value })}>
            {TIPO_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="field">
        <label className="field-label">Horários (separados por vírgula)</label>
        <input className="field-input" placeholder="Ex: 08:00, 20:00" value={draft.horariosRaw} onChange={(e) => set({ horariosRaw: e.target.value })} />
      </div>
      <div className="field">
        <label className="field-label">Repetição</label>
        <select className="field-input" value={draft.rep} onChange={(e) => set({ rep: e.target.value })}>
          {REPEAT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label className="field-label">Instruções</label>
        <input className="field-input" placeholder="Ex: Tomar com estômago cheio" value={draft.instrucoes} onChange={(e) => set({ instrucoes: e.target.value })} />
      </div>
    </div>
  );
}
