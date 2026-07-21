import { NavLink } from 'react-router-dom';

export default function Sidebar({ brand, navItems, onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand-logo">✨ {brand}</div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span aria-hidden="true">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)' }}>
        <button className="nav-link" style={{ color: 'var(--color-danger-ink)', width: '100%' }} onClick={onLogout}>
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
