import { motion } from 'framer-motion';

const SIZE = 220;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = Math.PI * RADIUS; // half circle

const CLASS_COLOR = {
  'Excelente': 'var(--success)',
  'Boa': 'var(--accent)',
  'Moderada': 'var(--warning)',
  'Baixa': 'var(--warning)',
  'Crítica': 'var(--danger)'
};

export default function AdherenceGauge({ value, classification }) {
  const offset = CIRC - (value / 100) * CIRC;
  const color = CLASS_COLOR[classification] || 'var(--accent)';

  return (
    <div className="gauge-wrap" style={{ width: SIZE, height: SIZE / 2 + 24 }}>
      <svg width={SIZE} height={SIZE / 2 + STROKE}>
        <g transform={`translate(${STROKE / 2}, ${STROKE / 2})`}>
          <path
            d={`M 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS * 2} ${RADIUS}`}
            fill="none" stroke="var(--surface-sunken)" strokeWidth={STROKE} strokeLinecap="round"
          />
          <motion.path
            d={`M 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS * 2} ${RADIUS}`}
            fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </g>
      </svg>
      <div className="gauge-center">
        <span className="display-md" style={{ lineHeight: 1 }}>{value}</span>
        <span className="eyebrow" style={{ marginTop: 4, color }}>{classification}</span>
      </div>
    </div>
  );
}
