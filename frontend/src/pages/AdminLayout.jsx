import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppCanvas from '../components/AppCanvas.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useConfirm } from '../context/ConfirmContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const NAV_ITEMS = [{ to: '/admin', end: true, icon: '☷', label: 'Pacientes' }];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { setThemeClass } = useTheme();
  const confirm = useConfirm();

  useEffect(() => {
    setThemeClass('');
  }, [setThemeClass]);

  const handleLogout = async () => {
    const ok = await confirm({ title: 'Encerrar sessão', description: 'Tem certeza que deseja sair?', confirmLabel: 'Sair' });
    if (ok) logout();
  };

  return (
    <AppCanvas mark="✦" navItems={NAV_ITEMS} onLogout={handleLogout}>
      <Outlet />
    </AppCanvas>
  );
}
