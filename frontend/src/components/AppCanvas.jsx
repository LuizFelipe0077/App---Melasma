import { NavLink } from 'react-router-dom';

export default function AppCanvas({ mark, navItems, onLogout, children }) {
  return (
    <div className="app-canvas">
      <aside className="rail">
        <span className="rail-mark" aria-hidden="true">{mark}</span>
        <nav className="rail-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `rail-link${isActive ? ' active' : ''}`}
              title={item.label}
              aria-label={item.label}
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
        <button className="rail-link" onClick={onLogout} title="Sair" aria-label="Sair da conta">⏻</button>
      </aside>

      <div className="canvas-main">
        <div className="canvas-topbar">
          <span className="rail-mark" aria-hidden="true">{mark}</span>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Sair</button>
        </div>

        <div className="canvas-content animate-in">{children}</div>
      </div>

      <nav className="pill-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `pill-nav-item${isActive ? ' active' : ''}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
