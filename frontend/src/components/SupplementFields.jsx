import SupplementDatePicker, { WEEKDAY_CODES } from './SupplementDatePicker.jsx';

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const TIPO_OPTIONS = ['Manipulado', 'Industrializado', 'Fitoterápico', 'Vitamina', 'Mineral', 'Outro'];

const emptySchedule = { mode: 'todos', weekdays: [], specificDates: [] };

export const emptySupplementDraft = { nome: '', dosagem: '', quantidade: 1, tipo: 'Manipulado', horariosRaw: '', instrucoes: '', schedule: emptySchedule };

/** Reconstructs the picker's schedule state from a persisted supplement's diasSemana/datasEspecificas. */
function scheduleFromSuplemento(sup) {
  const datasEspecificas = Array.isArray(sup.datasEspecificas) ? sup.datasEspecificas : [];
  if (datasEspecificas.length > 0) {
    return { mode: 'especificas', weekdays: [], specificDates: datasEspecificas.map((d) => new Date(d)) };
  }
  const diasSemana = Array.isArray(sup.diasSemana) ? sup.diasSemana : ['todos'];
  if (diasSemana.includes('todos') || diasSemana.includes('Todos os dias')) {
    return { mode: 'todos', weekdays: [], specificDates: [] };
  }
  if (diasSemana.includes('dias_alternados') || diasSemana.includes('Dias alternados')) {
    return { mode: 'dias_alternados', weekdays: [], specificDates: [] };
  }
  if (diasSemana.includes('finais_de_semana') || diasSemana.includes('Finais de semana')) {
    return { mode: 'semana', weekdays: ['Sáb', 'Dom'], specificDates: [] };
  }
  return { mode: 'semana', weekdays: diasSemana.filter((d) => WEEKDAY_CODES.includes(d)), specificDates: [] };
}

export function draftFromSuplemento(sup) {
  return {
    nome: sup.nome || '',
    dosagem: sup.dosagem || '',
    quantidade: sup.quantidade ?? 1,
    tipo: sup.tipo || 'Manipulado',
    horariosRaw: (sup.horarios || []).join(', '),
    instrucoes: sup.instrucoes || '',
    schedule: scheduleFromSuplemento(sup)
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

  const { mode, weekdays, specificDates } = draft.schedule;
  if (mode === 'semana' && weekdays.length === 0) {
    onError('Selecione ao menos um dia da semana.');
    return null;
  }
  if (mode === 'especificas' && specificDates.length === 0) {
    onError('Selecione ao menos uma data específica no calendário.');
    return null;
  }

  const diasSemana = mode === 'todos' ? ['todos'] : mode === 'dias_alternados' ? ['dias_alternados'] : mode === 'semana' ? weekdays : [];
  const datasEspecificas = mode === 'especificas' ? specificDates.map((d) => d.toISOString()) : [];

  return {
    nome: draft.nome.trim(),
    dosagem: draft.dosagem.trim(),
    quantidade: Number(draft.quantidade) || 1,
    tipo: draft.tipo,
    horarios,
    diasSemana,
    datasEspecificas,
    instrucoes: draft.instrucoes.trim()
  };
}

export default function SupplementFields({ draft, onChange, dataInicio, dataFim, protocoloNome }) {
  const set = (patch) => onChange({ ...draft, ...patch });

  return (
    <div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">Nome</label>
          <input className="field-input" placeholder="Ex: Vitamina C" value={draft.nome} onChange={(e) => set({ nome: e.target.value })} />
        </div>
        <div className="field">
          <label className="field-label">Dosagem</label>
          <input className="field-input" placeholder="Ex: 500mg" value={draft.dosagem} onChange={(e) => set({ dosagem: e.target.value })} />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label className="field-label">Quantidade</label>
          <input type="number" min="1" className="field-input" value={draft.quantidade} onChange={(e) => set({ quantidade: e.target.value })} />
        </div>
        <div className="field">
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
        <label className="field-label">Agendamento</label>
        <SupplementDatePicker
          dataInicio={dataInicio}
          dataFim={dataFim}
          protocoloNome={protocoloNome}
          schedule={draft.schedule}
          onChange={(schedule) => set({ schedule })}
        />
      </div>
      <div className="field">
        <label className="field-label">Instruções</label>
        <input className="field-input" placeholder="Ex: Tomar com estômago cheio" value={draft.instrucoes} onChange={(e) => set({ instrucoes: e.target.value })} />
      </div>
    </div>
  );
}
