export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-bar no-print" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          aria-selected={active === t.value}
          className={`tab-item${active === t.value ? ' active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
