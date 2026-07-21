import { NavLink } from 'react-router-dom';

export default function BottomNav({ items }) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
        >
          <span aria-hidden="true" style={{ fontSize: '18px' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
