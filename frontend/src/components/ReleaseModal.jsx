import { useState } from 'react';
import Modal from './Modal.jsx';

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
    <Modal
      open={open}
      onClose={onClose}
      title="Liberar Edição Retroativa"
      description="Conceder autorização temporária para o paciente preencher check-ins antigos que esqueceu de registrar."
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Janela de Liberação (em horas)</label>
          <input type="number" className="form-input" min="1" max="72" required value={horas} onChange={(e) => setHoras(e.target.value)} />
        </div>
        <div className="form-group mb-5">
          <label className="form-label">Justificativa Clínica/Operacional</label>
          <textarea
            className="form-input"
            minLength={10}
            required
            placeholder="Ex: Paciente esqueceu de registrar o consumo do suplemento matinal ontem."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-success" disabled={saving}>{saving ? 'Autorizando...' : 'Autorizar Liberação'}</button>
        </div>
      </form>
    </Modal>
  );
}
