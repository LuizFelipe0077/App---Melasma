import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiClient } from '../api/apiClient.js';
import AdherenceChart from '../components/patientHistory/AdherenceChart.jsx';
import AlertsPanel from '../components/patientHistory/AlertsPanel.jsx';
import ClinicalNotes from '../components/patientHistory/ClinicalNotes.jsx';
import Heatmap from '../components/patientHistory/Heatmap.jsx';
import Timeline from '../components/patientHistory/Timeline.jsx';
import WeeklyEvolution from '../components/patientHistory/WeeklyEvolution.jsx';
import { protocolToThemeClass, useTheme } from '../context/ThemeContext.jsx';
import { buildDailyAdherence, buildDayRecords, buildWeeklyEvolution, computeAlerts } from '../utils/buildDayRecords.js';

const FILTERS = [
  { value: '7', label: '7 dias' },
  { value: '15', label: '15 dias' },
  { value: '30', label: '30 dias' },
  { value: 'all', label: 'Todo o tratamento' }
];

function statusFromRate(rate) {
  if (rate >= 80) return { cls: 'ok', label: 'Em dia' };
  if (rate >= 60) return { cls: 'warning', label: 'Atenção' };
  return { cls: 'danger', label: 'Atrasado' };
}

export default function PatientHistoryPage() {
  const { pacienteId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { setThemeClass } = useTheme();

  const [patient, setPatient] = useState(location.state?.patient || null);
  const [patientLoading, setPatientLoading] = useState(!location.state?.patient);
  const [filter, setFilter] = useState('all');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Direct URL access (no location.state) — look the patient up by id.
  useEffect(() => {
    if (patient) return;
    ApiClient.call('listarPacientes')
      .then((list) => setPatient(list.find((p) => p.id === pacienteId) || null))
      .finally(() => setPatientLoading(false));
  }, [pacienteId, patient]);

  useEffect(() => {
    setThemeClass(patient ? protocolToThemeClass(patient.protocoloNome) : '');
    return () => setThemeClass('');
  }, [patient, setThemeClass]);

  const window_ = useMemo(() => {
    if (!patient) return null;
    const treatmentStart = new Date(patient.dataInicio);
    const treatmentEnd = new Date(patient.dataFim);
    const cappedEnd = new Date(Math.min(treatmentEnd.getTime(), treatmentStart.getTime() + 90 * 86400000));
    const today = new Date();

    if (filter === 'all') {
      return { start: treatmentStart, end: cappedEnd };
    }
    const days = Number(filter);
    const start = new Date(Math.max(treatmentStart.getTime(), today.getTime() - (days - 1) * 86400000));
    const end = new Date(Math.min(cappedEnd.getTime(), today.getTime()));
    return { start, end: end < start ? start : end };
  }, [patient, filter]);

  useEffect(() => {
    if (!window_ || !patient) return;
    setLoading(true);
    setError(null);
    ApiClient.call('gerarDashboard', {
      pacienteId: patient.id,
      dataInicio: window_.start.toISOString(),
      dataFim: window_.end.toISOString()
    })
      .then(setDashboard)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [window_, patient]);

  const days = useMemo(() => {
    if (!dashboard || !window_ || !patient) return [];
    return buildDayRecords(dashboard, patient.dataInicio, window_.start, window_.end);
  }, [dashboard, window_, patient]);

  const weeklyEvolution = useMemo(() => buildWeeklyEvolution(days), [days]);
  const dailyAdherence = useMemo(() => buildDailyAdherence(days, 30), [days]);
  const alerts = useMemo(() => computeAlerts(days, dashboard?.gamificacao), [days, dashboard]);

  const treatmentStats = useMemo(() => {
    if (!patient) return null;
    const start = new Date(patient.dataInicio);
    const end = new Date(patient.dataFim);
    const total = Math.max(1, Math.round((end - start) / 86400000) + 1);
    const elapsed = Math.min(total, Math.max(0, Math.round((new Date() - start) / 86400000) + 1));
    return { total, elapsed, remaining: total - elapsed, percent: Math.round((elapsed / total) * 100) };
  }, [patient]);

  const perfectDays = days.filter((d) => d.status === 'completed').length;
  const failedDays = days.filter((d) => d.status === 'missed').length;

  const handleExportCsv = () => {
    const rows = [['Dia', 'Data', 'Suplemento', 'Horário previsto', 'Horário realizado', 'Status']];
    for (const day of days) {
      for (const c of day.checkins) {
        rows.push([
          day.dayNumber,
          day.date.toLocaleDateString('pt-BR'),
          c.suplemento?.nome || '',
          new Date(c.dataHoraPrescrita).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          c.dataHoraRealizada ? new Date(c.dataHoraRealizada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '',
          c.status
        ]);
      }
    }
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico-${patient.nome.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (patientLoading) {
    return <div className="skeleton" style={{ height: 200 }} />;
  }
  if (!patient) {
    return <p className="empty-state">Paciente não encontrado.</p>;
  }

  const status = statusFromRate(dashboard?.taxaAdesaoGeral ?? 0);

  return (
    <>
      <button className="back-link no-print" onClick={() => navigate('/admin')}>← Voltar para pacientes</button>

      <header className="flex items-center gap-4" style={{ margin: 'var(--space-5) 0 var(--space-6)', flexWrap: 'wrap' }}>
        <div className="avatar">{patient.nome.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="display-sm">{patient.nome}</h1>
          <p className="body-sm">{patient.protocoloNome || 'Protocolo não definido'} · {new Date(patient.dataInicio).toLocaleDateString('pt-BR')} a {new Date(patient.dataFim).toLocaleDateString('pt-BR')}</p>
        </div>
        <span className={`status-dot ${status.cls}`}>{status.label}</span>
        <button className="btn btn-ghost btn-sm no-print" onClick={handleExportCsv}>Exportar CSV</button>
        <button className="btn btn-ghost btn-sm no-print" onClick={() => window.print()}>Exportar PDF</button>
      </header>

      {treatmentStats && (
        <div className="flex gap-4 no-print" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.elapsed}</div><div className="metric-label">Dias concluídos</div></div>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.remaining}</div><div className="metric-label">Dias restantes</div></div>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.percent}%</div><div className="metric-label">Do tratamento concluído</div></div>
        </div>
      )}

      <div className="filter-row no-print" style={{ marginBottom: 'var(--space-6)' }}>
        {FILTERS.map((f) => (
          <button key={f.value} className={filter === f.value ? 'btn btn-fill btn-sm' : 'btn btn-ghost btn-sm'} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="empty-state">Não foi possível carregar os dados: {error.message}</p>
      ) : loading ? (
        <div className="skeleton" style={{ height: 300 }} />
      ) : (
        <>
          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Resumo geral</h2>
          <div className="flex gap-4" style={{ marginBottom: 'var(--space-7)', flexWrap: 'wrap' }}>
            <div className="surface metric-card"><div className="metric-value">{(dashboard.totalConsumido || 0) + (dashboard.totalAtrasado || 0)}</div><div className="metric-label">Check-ins realizados</div></div>
            <div className="surface metric-card"><div className="metric-value">{dashboard.totalPrescrito}</div><div className="metric-label">Suplementos programados</div></div>
            <div className="surface metric-card"><div className="metric-value">{dashboard.taxaAdesaoGeral}%</div><div className="metric-label">Adesão</div></div>
            <div className="surface metric-card"><div className="metric-value">{perfectDays}</div><div className="metric-label">Dias perfeitos</div></div>
            <div className="surface metric-card"><div className="metric-value">{failedDays}</div><div className="metric-label">Dias com falhas</div></div>
            <div className="surface metric-card"><div className="metric-value">{dashboard.gamificacao?.streakAtual ?? 0}</div><div className="metric-label">Sequência atual</div></div>
            <div className="surface metric-card"><div className="metric-value">{dashboard.gamificacao?.maiorStreak ?? 0}</div><div className="metric-label">Maior sequência</div></div>
          </div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Alertas</h2>
          <div style={{ marginBottom: 'var(--space-7)' }}><AlertsPanel alerts={alerts} /></div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Adesão — últimos 30 dias</h2>
          <div className="surface surface-pad" style={{ marginBottom: 'var(--space-7)' }}><AdherenceChart points={dailyAdherence} /></div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Mapa de calor</h2>
          <div className="surface surface-pad" style={{ marginBottom: 'var(--space-7)' }}><Heatmap days={days} /></div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Evolução semanal</h2>
          <div style={{ marginBottom: 'var(--space-7)' }}><WeeklyEvolution weeks={weeklyEvolution} /></div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Linha do tempo</h2>
          <div className="surface" style={{ marginBottom: 'var(--space-7)', padding: '0 var(--space-4)' }}><Timeline days={days} /></div>

          <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Observações clínicas</h2>
          <div className="surface surface-pad">
            <ClinicalNotes pacienteId={patient.id} />
          </div>
        </>
      )}
    </>
  );
}
