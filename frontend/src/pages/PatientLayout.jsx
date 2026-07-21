import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppCanvas from '../components/AppCanvas.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { protocolToThemeClass, useTheme } from '../context/ThemeContext.jsx';

const NAV_ITEMS = [
  { to: '/paciente', end: true, icon: '◐', label: 'Hoje' },
  { to: '/paciente/historico', icon: '☰', label: 'Histórico' },
  { to: '/paciente/calendario', icon: '▦', label: 'Calendário' }
];

export default function PatientLayout() {
  const { session, logout } = useAuth();
  const { setThemeClass } = useTheme();
  const confirm = useConfirm();

  useEffect(() => {
    setThemeClass(protocolToThemeClass(session.protocolo));
    return () => setThemeClass('');
  }, [session.protocolo, setThemeClass]);

  const handleLogout = async () => {
    const ok = await confirm({ title: 'Encerrar sessão', description: 'Tem certeza que deseja sair?', confirmLabel: 'Sair' });
    if (ok) logout();
  };

  return (
    <AppCanvas mark="✧" navItems={NAV_ITEMS} onLogout={handleLogout}>
      <Outlet />
    </AppCanvas>
  );
}
