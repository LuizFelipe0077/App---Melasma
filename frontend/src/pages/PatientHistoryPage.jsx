import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ApiClient } from '../api/apiClient.js';
import AdherenceChart from '../components/patientHistory/AdherenceChart.jsx';
import AdherenceIndexCard from '../components/patientHistory/AdherenceIndexCard.jsx';
import AlertsPanel from '../components/patientHistory/AlertsPanel.jsx';
import ChronologicalRecord from '../components/patientHistory/ChronologicalRecord.jsx';
import ClinicalNotes, { INTERVENCAO_TIPOS } from '../components/patientHistory/ClinicalNotes.jsx';
import ClinicalSummary from '../components/patientHistory/ClinicalSummary.jsx';
import ConsistencyMap from '../components/patientHistory/ConsistencyMap.jsx';
import Heatmap from '../components/patientHistory/Heatmap.jsx';
import QuickActions from '../components/patientHistory/QuickActions.jsx';
import RiskCard from '../components/patientHistory/RiskCard.jsx';
import Sheet from '../components/Sheet.jsx';
import Tabs from '../components/patientHistory/Tabs.jsx';
import WeeklyEvolution from '../components/patientHistory/WeeklyEvolution.jsx';
import ManagePatientModal from '../components/ManagePatientModal.jsx';
import ReleaseModal from '../components/ReleaseModal.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { protocolToThemeClass, useTheme } from '../context/ThemeContext.jsx';
import { buildDailyAdherence, buildDayRecords, buildWeeklyEvolution, computeAlerts } from '../utils/buildDayRecords.js';
import { computeAdherenceIndex, computeClinicalSummary, computeConsistencyMap, computeRiskLevel, mergeChronologicalEvents } from '../utils/patientInsights.js';

const FILTERS = [
  { value: '7', label: '7 dias' },
  { value: '15', label: '15 dias' },
  { value: '30', label: '30 dias' },
  { value: 'all', label: 'Todo o tratamento' }
];

const TABS = [
  { value: 'geral', label: 'Visão Geral' },
  { value: 'clinico', label: 'Histórico Clínico' },
  { value: 'intervencoes', label: 'Intervenções' }
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
  const { showToast, showError } = useToast();

  const [patient, setPatient] = useState(location.state?.patient || null);
  const [patientLoading, setPatientLoading] = useState(!location.state?.patient);
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('geral');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [permissoes, setPermissoes] = useState([]);

  const [manageOpen, setManageOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);

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

  const loadNotesAndPermissoes = () => {
    if (!patient) return;
    ApiClient.call('listarObservacoesClinicas', { pacienteId: patient.id }).then(setNotes).catch(() => setNotes([]));
    ApiClient.call('listarPermissoesRetroativas', { pacienteId: patient.id }).then(setPermissoes).catch(() => setPermissoes([]));
  };

  useEffect(loadNotesAndPermissoes, [patient]);

  const days = useMemo(() => {
    if (!dashboard || !window_ || !patient) return [];
    return buildDayRecords(dashboard, patient.dataInicio, window_.start, window_.end);
  }, [dashboard, window_, patient]);

  const weeklyEvolution = useMemo(() => buildWeeklyEvolution(days), [days]);
  const dailyAdherence = useMemo(() => buildDailyAdherence(days, 30), [days]);
  const alerts = useMemo(() => computeAlerts(days, dashboard?.gamificacao), [days, dashboard]);

  const adherenceIndex = useMemo(() => (dashboard ? computeAdherenceIndex(dashboard.taxaAdesaoGeral, days, dashboard.gamificacao) : null), [dashboard, days]);
  const risk = useMemo(() => (dashboard ? computeRiskLevel(days, dashboard.gamificacao) : null), [dashboard, days]);
  const consistencyMap = useMemo(() => computeConsistencyMap(days), [days]);
  const clinicalSummary = useMemo(
    () => (dashboard ? computeClinicalSummary(days, dashboard.historicoAgrupadoPorSuplemento, dashboard.gamificacao, consistencyMap) : null),
    [dashboard, days, consistencyMap]
  );

  const observacoesOriginais = useMemo(() => notes.filter((n) => !INTERVENCAO_TIPOS.some((t) => t.value === n.tipo)), [notes]);
  const chronologicalDays = useMemo(() => mergeChronologicalEvents(days, observacoesOriginais, permissoes), [days, observacoesOriginais, permissoes]);

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

  const handleSavePatient = async (payload) => {
    try {
      await ApiClient.call('editarPaciente', payload);
      showToast({ message: 'Paciente atualizado.' });
      setManageOpen(false);
      setPatient((p) => ({ ...p, ...payload, id: p.id }));
    } catch (err) {
      showError(`Erro ao salvar: ${err.message}`);
      throw err;
    }
  };

  const handleDeletePatient = async () => {
    try {
      await ApiClient.call('excluirPaciente', { pacienteId: patient.id });
      showToast({ message: 'Paciente excluído.' });
      navigate('/admin');
    } catch (err) {
      showError(`Erro ao excluir: ${err.message}`);
    }
  };

  const handleRelease = async (payload) => {
    try {
      await ApiClient.call('liberarEdicaoRetroativa', payload);
      showToast({ message: 'Liberação concedida.' });
      setReleaseOpen(false);
      loadNotesAndPermissoes();
    } catch (err) {
      showError(`Erro ao liberar: ${err.message}`);
    }
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

      <header className="flex items-center gap-4" style={{ margin: 'var(--space-5) 0 var(--space-5)', flexWrap: 'wrap' }}>
        <div className="avatar">{patient.nome.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="display-sm">{patient.nome}</h1>
          <p className="body-sm">{patient.protocoloNome || 'Protocolo não definido'} · {new Date(patient.dataInicio).toLocaleDateString('pt-BR')} a {new Date(patient.dataFim).toLocaleDateString('pt-BR')}</p>
        </div>
        <span className={`status-dot ${status.cls}`}>{status.label}</span>
        <button className="btn btn-ghost btn-sm no-print" onClick={handleExportCsv}>Exportar CSV</button>
        <button className="btn btn-ghost btn-sm no-print" onClick={() => window.print()}>Exportar PDF</button>
      </header>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <QuickActions
          patient={patient}
          onEdit={() => setManageOpen(true)}
          onRelease={() => setReleaseOpen(true)}
          onAddNote={() => setQuickNoteOpen(true)}
        />
      </div>

      {treatmentStats && (
        <div className="metric-grid no-print" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.elapsed}</div><div className="metric-label">Dias concluídos</div></div>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.remaining}</div><div className="metric-label">Dias restantes</div></div>
          <div className="surface metric-card"><div className="metric-value">{treatmentStats.percent}%</div><div className="metric-label">Do tratamento concluído</div></div>
        </div>
      )}

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

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
          {tab === 'geral' && (
            <>
              <div className="flex gap-4" style={{ marginBottom: 'var(--space-7)', flexWrap: 'wrap', alignItems: 'stretch' }}>
                <div style={{ flex: '1 1 420px' }}>{adherenceIndex && <AdherenceIndexCard index={adherenceIndex} />}</div>
                <div style={{ flex: '1 1 280px' }}>{risk && <RiskCard risk={risk} />}</div>
              </div>

              {clinicalSummary && <div style={{ marginBottom: 'var(--space-7)' }}><ClinicalSummary summary={clinicalSummary} /></div>}
              <div style={{ marginBottom: 'var(--space-7)' }}><ConsistencyMap map={consistencyMap} /></div>

              <h2 className="display-sm" style={{ marginBottom: 'var(--space-4)' }}>Resumo geral</h2>
              <div className="metric-grid" style={{ marginBottom: 'var(--space-7)' }}>
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
              <div><WeeklyEvolution weeks={weeklyEvolution} /></div>
            </>
          )}

          {tab === 'clinico' && (
            <div className="surface" style={{ padding: '0 var(--space-4)' }}>
              <ChronologicalRecord days={chronologicalDays} />
            </div>
          )}

          {tab === 'intervencoes' && (
            <div className="surface surface-pad">
              <ClinicalNotes
                pacienteId={patient.id}
                tipoOptions={INTERVENCAO_TIPOS}
                filterTipos={INTERVENCAO_TIPOS.map((t) => t.value)}
                emptyLabel="Nenhuma intervenção registrada ainda."
              />
            </div>
          )}
        </>
      )}

      <ManagePatientModal
        open={manageOpen}
        patient={patient}
        onClose={() => setManageOpen(false)}
        onSave={handleSavePatient}
        onDelete={handleDeletePatient}
      />
      <ReleaseModal open={releaseOpen} patientId={patient.id} onClose={() => setReleaseOpen(false)} onSubmit={handleRelease} />

      <Sheet open={quickNoteOpen} onClose={() => setQuickNoteOpen(false)} title="Adicionar observação clínica">
        <ClinicalNotes pacienteId={patient.id} />
      </Sheet>
    </>
  );
}
