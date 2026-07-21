import { useEffect, useMemo, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import AppShell from '../components/AppShell.jsx';
import { StatCard } from '../components/StatCard.jsx';
import PatientTable from '../components/PatientTable.jsx';
import RegisterPatientWizard from '../components/RegisterPatientWizard.jsx';
import ManagePatientModal from '../components/ManagePatientModal.jsx';
import ReleaseModal from '../components/ReleaseModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const NAV_ITEMS = [{ to: '/admin', end: true, icon: '👥', label: 'Pacientes Ativos' }];

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
      const result = await ApiClient.call('listarPacientes');
      setPatients(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

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
    const ok = await confirm({ title: 'Encerrar sessão', description: 'Tem certeza que deseja encerrar a sua sessão administrativa?', confirmLabel: 'Sair' });
    if (ok) logout();
  };

  const handleCreatePatient = async (payload) => {
    try {
      await ApiClient.call('criarPaciente', payload);
      showToast({ message: 'Paciente cadastrado com sucesso!' });
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
      showToast({ message: 'Paciente atualizado com sucesso!' });
      setManagePatient(null);
      await loadPatients();
    } catch (err) {
      showError(`Erro ao salvar alterações: ${err.message}`);
      throw err;
    }
  };

  const handleDeletePatient = async (pacienteId) => {
    try {
      await ApiClient.call('excluirPaciente', { pacienteId });
      showToast({ message: 'Paciente excluído com sucesso!' });
      setManagePatient(null);
      await loadPatients();
    } catch (err) {
      showError(`Erro ao excluir paciente: ${err.message}`);
    }
  };

  const handleRelease = async (payload) => {
    try {
      await ApiClient.call('liberarEdicaoRetroativa', payload);
      showToast({ message: 'Permissão de edição retroativa concedida com sucesso!' });
      setReleasePatientId(null);
    } catch (err) {
      showError(`Erro ao conceder liberação: ${err.message}`);
    }
  };

  return (
    <AppShell brand="Clinical Admin" navItems={NAV_ITEMS} onLogout={handleLogout}>
      <header className="header mb-6">
        <div>
          <h1 className="text-h1 text-2xl">Painel de Monitoramento Clínico</h1>
          <p className="text-p">Gestão de adesão e cadastros de pacientes do consultório.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          <span className="text-xl" style={{ lineHeight: 1 }}>+</span> Novo Paciente
        </button>
      </header>

      <div className="grid grid-cols-1 md-grid-cols-3 gap-4 mb-6">
        <StatCard label="Alerta de Abandono (<60%)" value={loading ? '--' : stats.abandon} color="var(--color-danger-ink)" />
        <StatCard label="Adesão Excelente (>90%)" value={loading ? '--' : stats.excellent} color="var(--color-success-ink)" />
        <StatCard label="Total de Pacientes Ativos" value={loading ? '--' : stats.total} color="var(--color-brand-primary)" />
      </div>

      <section className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="flex justify-between items-center" style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-h1 text-lg" style={{ margin: 0 }}>Lista de Acompanhamento</h3>
          <input
            className="form-input"
            style={{ maxWidth: 300, padding: '8px 12px' }}
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div style={{ padding: 24 }}><div className="skeleton w-full" style={{ height: 20 }} /></div>
        ) : error ? (
          <p className="error-text">Erro ao ler lista: {error.message}</p>
        ) : (
          <PatientTable
            patients={filteredPatients}
            onRowClick={setManagePatient}
            onReleaseClick={setReleasePatientId}
          />
        )}
      </section>

      <RegisterPatientWizard open={registerOpen} onClose={() => setRegisterOpen(false)} onSubmit={handleCreatePatient} />
      <ManagePatientModal
        open={!!managePatient}
        patient={managePatient}
        onClose={() => setManagePatient(null)}
        onSave={handleSavePatient}
        onDelete={handleDeletePatient}
      />
      <ReleaseModal
        open={!!releasePatientId}
        patientId={releasePatientId}
        onClose={() => setReleasePatientId(null)}
        onSubmit={handleRelease}
      />
    </AppShell>
  );
}
