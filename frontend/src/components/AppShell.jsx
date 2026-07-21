import Sidebar from './Sidebar.jsx';
import MobileTopBar from './MobileTopBar.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppShell({ brand, navItems, onLogout, children }) {
  return (
    <div className="app-shell">
      <Sidebar brand={brand} navItems={navItems} onLogout={onLogout} />
      <div className="flex flex-col" style={{ minHeight: '100vh', overflowY: 'auto' }}>
        <MobileTopBar title={brand} onLogout={onLogout} />
        <main className="main-content main-content-with-bottom-nav" style={{ flex: 1 }}>
          <div className="container">{children}</div>
        </main>
        <BottomNav items={navItems} />
      </div>
    </div>
  );
}
