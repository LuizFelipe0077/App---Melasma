import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function computeCountdown(dataInicio) {
  const diffMs = new Date(dataInicio) - new Date();
  if (diffMs <= 0) return null;
  const diffHours = diffMs / 3600000;
  if (diffHours >= 24) {
    const days = Math.ceil(diffHours / 24);
    return { value: days, unit: days === 1 ? 'dia' : 'dias' };
  }
  const hours = Math.max(1, Math.ceil(diffHours));
  return { value: hours, unit: hours === 1 ? 'hora' : 'horas' };
}

/**
 * Full-page gate shown while session.dataInicio is still in the future.
 * Deliberately rendered outside AppCanvas — with no sub-routes to navigate
 * to yet, an empty nav rail/pill-nav would just be dead chrome on screen.
 */
export default function ProtocolPendingScreen({ dataInicio, onLogout }) {
  const [countdown, setCountdown] = useState(() => computeCountdown(dataInicio));

  useEffect(() => {
    const id = setInterval(() => setCountdown(computeCountdown(dataInicio)), 60000);
    return () => clearInterval(id);
  }, [dataInicio]);

  const startLabel = new Date(dataInicio).toLocaleDateString('pt-BR');

  return (
    <div className="flex flex-col items-center text-center" style={{ minHeight: '100dvh', justifyContent: 'center', padding: 'var(--space-6)', position: 'relative' }}>
      <button
        className="btn btn-ghost btn-sm"
        onClick={onLogout}
        style={{ position: 'absolute', top: 'var(--space-5)', right: 'var(--space-5)' }}
      >
        Sair
      </button>

      <motion.div
        style={{ maxWidth: 440 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-5)' }} aria-hidden="true">🌿</div>
        <h1 className="display-md" style={{ marginBottom: 'var(--space-4)' }}>Seu protocolo está sendo preparado</h1>
        <p className="body-md" style={{ marginBottom: 'var(--space-6)' }}>
          Seu tratamento começará em <strong style={{ color: 'var(--ink)' }}>{startLabel}</strong>. Estamos organizando todas as etapas para que sua experiência seja perfeita.
        </p>

        {countdown && (
          <div className="surface surface-pad" style={{ marginBottom: 'var(--space-6)' }}>
            <span className="eyebrow">Faltam</span>
            <div className="display-lg" style={{ marginTop: 'var(--space-2)' }}>{countdown.value} {countdown.unit}</div>
          </div>
        )}

        <p className="body-sm">
          Quando chegar o dia do início, todo o conteúdo será liberado automaticamente. Até lá, aproveite para conhecer um pouco mais sobre o seu tratamento.
        </p>
      </motion.div>
    </div>
  );
}
