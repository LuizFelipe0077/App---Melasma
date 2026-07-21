import { useEffect, useMemo, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import AppCanvas from '../components/AppCanvas.jsx';
import StatChip from '../components/StatChip.jsx';
import PatientTable from '../components/PatientTable.jsx';
import RegisterPatientWizard from '../components/RegisterPatientWizard.jsx';
import ManagePatientModal from '../components/ManagePatientModal.jsx';
import ReleaseModal from '../components/ReleaseModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const NAV_ITEMS = [{ to: '/admin', end: true, icon: '☷', label: 'Pacientes' }];

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const { setThemeClass } = useTheme();
  const confirm = useConfirm();
  const { showToast, showError } = useToast();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const [registerOpen, setRegisterOpen] = useState(false);
  const [managePatient, setManagePatient] = useState(null);
  const [releasePatientId, setReleasePatientId] = useState(null);

  useEffect(() => {
    setThemeClass('');
  }, [setThemeClass]);

  const loadPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      setPatients(await ApiClient.call('listarPacientes'));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => p.nome.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  }, [patients, search]);

  const stats = useMemo(() => ({
    abandon: patients.filter((p) => p.rate < 60).length,
    excellent: patients.filter((p) => p.rate >= 90).length,
    total: patients.length
  }), [patients]);

  const handleLogout = async () => {
    const ok = await confirm({ title: 'Encerrar sessão', description: 'Tem certeza que deseja sair?', confirmLabel: 'Sair' });
    if (ok) logout();
  };

  const handleCreatePatient = async (payload) => {
    try {
      await ApiClient.call('criarPaciente', payload);
      showToast({ message: 'Paciente cadastrado.' });
      setRegisterOpen(false);
      await loadPatients();
    } catch (err) {
      showError(`Erro ao cadastrar: ${err.message}`);
      throw err;
    }
  };

  const handleSavePatient = async (payload) => {
    try {
      await ApiClient.call('editarPaciente', payload);
      showToast({ message: 'Paciente atualizado.' });
      setManagePatient(null);
      await loadPatients();
    } catch (err) {
      showError(`Erro ao salvar: ${err.message}`);
      throw err;
    }
  };

  const handleDeletePatient = async (pacienteId) => {
    try {
      await ApiClient.call('excluirPaciente', { pacienteId });
      showToast({ message: 'Paciente excluído.' });
      setManagePatient(null);
      await loadPatients();
    } catch (err) {
      showError(`Erro ao excluir: ${err.message}`);
    }
  };

  const handleRelease = async (payload) => {
    try {
      await ApiClient.call('liberarEdicaoRetroativa', payload);
      showToast({ message: 'Liberação concedida.' });
      setReleasePatientId(null);
    } catch (err) {
      showError(`Erro ao liberar: ${err.message}`);
    }
  };

  return (
    <AppCanvas mark="✦" navItems={NAV_ITEMS} onLogout={handleLogout}>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 className="display-md">Pacientes</h1>
        <button className="btn btn-fill" onClick={() => setRegisterOpen(true)}>+ Novo paciente</button>
      </div>

      <div className="flex gap-4" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <StatChip label="Alerta de abandono (<60%)" value={loading ? '—' : stats.abandon} tone="danger" />
        <StatChip label="Adesão excelente (>90%)" value={loading ? '—' : stats.excellent} tone="success" />
        <StatChip label="Total ativos" value={loading ? '—' : stats.total} />
      </div>

      <section className="surface" style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between" style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: 'var(--hairline) solid var(--line)' }}>
          <h2 className="display-sm" style={{ fontSize: '1.25rem' }}>Acompanhamento</h2>
          <input className="field-input" style={{ maxWidth: 260, padding: '8px 14px' }} placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div style={{ padding: 24 }}><div className="skeleton" style={{ height: 20 }} /></div>
        ) : error ? (
          <p className="empty-state">Erro ao carregar: {error.message}</p>
        ) : (
          <PatientTable patients={filteredPatients} onRowClick={setManagePatient} onReleaseClick={setReleasePatientId} />
        )}
      </section>

      <RegisterPatientWizard open={registerOpen} onClose={() => setRegisterOpen(false)} onSubmit={handleCreatePatient} />
      <ManagePatientModal open={!!managePatient} patient={managePatient} onClose={() => setManagePatient(null)} onSave={handleSavePatient} onDelete={handleDeletePatient} />
      <ReleaseModal open={!!releasePatientId} patientId={releasePatientId} onClose={() => setReleasePatientId(null)} onSubmit={handleRelease} />
    </AppCanvas>
  );
}
