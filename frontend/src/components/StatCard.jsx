export function StatCard({ label, value, color, onClick }) {
  return (
    <div
      className={`card card-stat${onClick ? ' card-interactive' : ''}`}
      style={{ '--stat-color': color || 'var(--color-brand-primary)', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <p className="text-sm text-secondary mb-2">{label}</p>
      <h3 className="text-2xl font-semibold" style={{ color: color || 'var(--color-text-primary)' }}>{value}</h3>
    </div>
  );
}

export function HeroStatCard({ rate, streak }) {
  return (
    <section
      className="card justify-center"
      style={{
        background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-accent))',
        color: 'white',
        border: 'none',
        minHeight: 200
      }}
    >
      <p className="text-sm font-medium mb-2" style={{ opacity: 0.9 }}>Adesão Geral ao Protocolo</p>
      <div className="flex items-baseline gap-3 mb-4">
        <h2 className="font-light" style={{ fontSize: '3.5rem', lineHeight: 1 }}>{rate}%</h2>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
          🔥 {streak} dias seguidos
        </span>
      </div>
      <div className="w-full" style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, rate)}%`,
            background: 'white',
            transition: 'width 1s ease-out'
          }}
        />
      </div>
    </section>
  );
}
