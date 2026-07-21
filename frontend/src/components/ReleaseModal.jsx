import { useState } from 'react';
import Sheet from './Sheet.jsx';

export default function ReleaseModal({ open, patientId, onClose, onSubmit }) {
  const [horas, setHoras] = useState(24);
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ pacienteId: patientId, horasLiberadas: horas, motivo });
      setMotivo('');
      setHoras(24);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Liberar edição retroativa" description="Autoriza o paciente a preencher check-ins de dias anteriores que esqueceu de registrar.">
      <form onSubmit={handleSubmit}>
        <div className="field"><label className="field-label">Janela (horas)</label><input type="number" className="field-input" min="1" max="72" required value={horas} onChange={(e) => setHoras(e.target.value)} /></div>
        <div className="field">
          <label className="field-label">Justificativa</label>
          <textarea className="field-input" minLength={10} required placeholder="Ex: esqueceu de registrar a dose da manhã" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-fill" disabled={saving}>{saving ? <span className="spinner" /> : 'Autorizar'}</button>
        </div>
      </form>
    </Sheet>
  );
}
