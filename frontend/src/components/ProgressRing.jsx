import { motion } from 'framer-motion';

/**
 * Circular progress ring (Apple Activity style) — replaces the old linear
 * gradient hero bar as the dashboard's adherence indicator.
 */
export default function ProgressRing({ value = 0, size = 168, stroke = 12, streak = 0 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--surface-sunken)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--accent)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="progress-ring-center">
        <span className="display-md" style={{ lineHeight: 1 }}>{clamped}%</span>
        <span className="eyebrow" style={{ marginTop: 6 }}>{streak} dias seguidos</span>
      </div>
    </div>
  );
}
