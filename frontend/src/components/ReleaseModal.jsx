import { useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import Sheet from './Sheet.jsx';

const STATUS_LABEL = { CONCLUIDO: '✔ Tomou', ATRASADO: '✔ Tomou (atrasado)', PENDENTE: '✖ Não tomou' };

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReleaseModal({ open, patientId, patientName, onClose, onSubmit }) {
  const [data, setData] = useState('');
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState({ loading: false, checkins: [], error: null });

  useEffect(() => {
    if (open) {
      setData('');
      setMotivo('');
      setSummary({ loading: false, checkins: [], error: null });
    }
  }, [open, patientId]);

  useEffect(() => {
    if (!data || !patientId) {
      setSummary({ loading: false, checkins: [], error: null });
      return;
    }
    let cancelled = false;
    setSummary({ loading: true, checkins: [], error: null });
    const isoDate = new Date(`${data}T00:00:00`).toISOString();
    ApiClient.call('gerarDashboard', { pacienteId: patientId, dataInicio: isoDate, dataFim: isoDate })
      .then((dashboard) => {
        if (cancelled) return;
        const byId = new Map((dashboard.historicoAgrupadoPorSuplemento || []).map((s) => [s.suplementoId, s]));
        const checkins = (dashboard.rawCheckins || []).map((c) => ({ ...c, suplemento: byId.get(c.suplementoId) }));
        setSummary({ loading: false, checkins, error: null });
      })
      .catch((err) => {
        if (!cancelled) setSummary({ loading: false, checkins: [], error: err.message });
      });
    return () => { cancelled = true; };
  }, [data, patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ pacienteId: patientId, dataLiberada: new Date(`${data}T00:00:00`).toISOString(), motivo });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Liberar retroativo"
      description={patientName ? `Paciente: ${patientName}` : undefined}
    >
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label">Data que será liberada</label>
          <input type="date" className="field-input" required max={todayStr()} value={data} onChange={(e) => setData(e.target.value)} />
        </div>

        {data && (
          <div className="field">
            <label className="field-label">Resumo dos suplementos deste dia</label>
            {summary.loading ? (
              <div className="skeleton" style={{ height: 40 }} />
            ) : summary.error ? (
              <p className="body-sm">Não foi possível carregar o resumo: {summary.error}</p>
            ) : summary.checkins.length === 0 ? (
              <p className="body-sm">Nenhum suplemento prescrito neste dia.</p>
            ) : (
              <div className="surface" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                {summary.checkins.map((c) => (
                  <div key={c.id} className="day-detail-row">
                    <div>
                      <div className="dose-name">{c.suplemento?.nome || 'Suplemento'}</div>
                      <div className="dose-meta">{formatTime(c.dataHoraPrescrita)}</div>
                    </div>
                    <span className={`chip ${c.status === 'PENDENTE' ? 'chip-danger' : c.status === 'ATRASADO' ? 'chip-warning' : 'chip-success'}`}>
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="field">
          <label className="field-label">Motivo da liberação (opcional)</label>
          <textarea className="field-input" placeholder="Ex: esqueceu de registrar a dose da manhã" value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>

        <p className="body-sm" style={{ marginBottom: 'var(--space-4)' }}>
          Esta autorização expirará automaticamente em 24 horas.
        </p>

        <div className="flex gap-3 justify-end">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-fill" disabled={saving || !data}>{saving ? <span className="spinner" /> : 'Autorizar'}</button>
        </div>
      </form>
    </Sheet>
  );
}
