import { motion } from 'framer-motion';
import { memo, useState } from 'react';

const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

function DoseTimelineItem({ suplemento, checkin, onCheck, onUndo }) {
  const [checking, setChecking] = useState(false);
  const isDone = checkin && checkin.status !== 'PENDENTE';

  const handleClick = () => {
    if (isDone) {
      onUndo(suplemento, checkin);
      return;
    }
    if (navigator.vibrate) navigator.vibrate(70);
    setChecking(true);
    onCheck(suplemento, checkin);
    setTimeout(() => setChecking(false), 260);
  };

  return (
    <div className={`timeline-item${isDone ? ' done' : ''}`}>
      <span className="timeline-dot" aria-hidden="true" />
      <div className={`dose-card${isDone ? ' done' : ''}${checking ? ' checking' : ''}`}>
        <div className="flex items-center gap-4">
          <span className="dose-time">{formatTime(checkin.dataHoraPrescrita)}</span>
          <div>
            <div className="dose-name">{suplemento.nome}</div>
            <div className="dose-meta">
              {suplemento.dosagem}
              {isDone && ` · tomado às ${formatTime(checkin.dataHoraRealizada)}`}
              {!isDone && suplemento.instrucoes && ` · ${suplemento.instrucoes}`}
            </div>
          </div>
        </div>
        <motion.button
          className={`dose-check${isDone ? ' done' : ''}`}
          onClick={handleClick}
          aria-label={isDone ? `Desfazer ${suplemento.nome}` : `Marcar ${suplemento.nome} como tomado`}
          whileTap={{ scale: 0.85 }}
          animate={isDone ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.32, ease: [0.34, 1.3, 0.64, 1] }}
        >
          {isDone ? '✓' : ''}
        </motion.button>
      </div>
    </div>
  );
}

export default memo(DoseTimelineItem);
