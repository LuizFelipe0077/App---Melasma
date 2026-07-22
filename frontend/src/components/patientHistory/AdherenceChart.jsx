const WIDTH = 600;
const HEIGHT = 160;
const PAD = 8;

export default function AdherenceChart({ points }) {
  const usable = points.filter((p) => p.rate !== null);
  if (usable.length < 2) {
    return <p className="empty-state">Dados insuficientes para o gráfico ainda.</p>;
  }

  const stepX = (WIDTH - PAD * 2) / (points.length - 1);
  const toY = (rate) => HEIGHT - PAD - (rate / 100) * (HEIGHT - PAD * 2);

  const coords = points.map((p, i) => ({ x: PAD + i * stepX, y: p.rate === null ? null : toY(p.rate) }));
  const validCoords = coords.filter((c) => c.y !== null);

  const linePath = validCoords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${validCoords[validCoords.length - 1].x.toFixed(1)} ${HEIGHT - PAD} L ${validCoords[0].x.toFixed(1)} ${HEIGHT - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height={HEIGHT} preserveAspectRatio="none">
      <line x1={PAD} y1={toY(100)} x2={WIDTH - PAD} y2={toY(100)} stroke="var(--line)" strokeWidth="1" />
      <line x1={PAD} y1={toY(0)} x2={WIDTH - PAD} y2={toY(0)} stroke="var(--line)" strokeWidth="1" />
      <path d={areaPath} fill="var(--accent)" opacity="0.12" />
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
