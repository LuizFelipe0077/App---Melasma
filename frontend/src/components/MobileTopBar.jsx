export default function MobileTopBar({ title, onLogout }) {
  return (
    <div className="mobile-topbar">
      <span className="brand-logo" style={{ marginBottom: 0 }}>✨ {title}</span>
      <button className="btn btn-outline btn-sm" onClick={onLogout}>Sair</button>
    </div>
  );
}
