import { motion } from 'framer-motion';
import { useState } from 'react';

let sharedAudioCtx = null;
function playSoftChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!sharedAudioCtx) sharedAudioCtx = new AudioContextClass();
    if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();

    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, sharedAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, sharedAudioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, sharedAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    osc.start();
    osc.stop(sharedAudioCtx.currentTime + 0.25);
  } catch {
    // audio blocked or unsupported — silent no-op
  }
}

const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function SupplementCard({ suplemento, checkin, onCheck, onUndo }) {
  const [checking, setChecking] = useState(false);
  const isTaken = checkin && checkin.status !== 'PENDENTE';

  const handleClick = () => {
    if (isTaken) {
      onUndo(suplemento, checkin);
      return;
    }
    setChecking(true);
    if (navigator.vibrate) navigator.vibrate(80);
    playSoftChime();
    setTimeout(() => {
      onCheck(suplemento, checkin);
      setChecking(false);
    }, 300);
  };

  return (
    <motion.div
      className={`supplement-card ${isTaken ? 'taken' : 'pending'}${checking ? ' checking' : ''}`}
      role="group"
      aria-label={`Suplemento ${suplemento.nome}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="supplement-card-left">
        <div className="time-badge">{formatTime(checkin.dataHoraPrescrita)}</div>
        <div>
          <h3 className="supplement-title">{suplemento.nome}</h3>
          <p className="supplement-dosage">{suplemento.dosagem}</p>
          {suplemento.instrucoes && <p className="supplement-instructions">💡 {suplemento.instrucoes}</p>}
        </div>
      </div>
      <button
        className={`btn-check ${isTaken ? 'taken' : 'pending'}`}
        onClick={handleClick}
        aria-label={isTaken ? `Desfazer ingestão do suplemento ${suplemento.nome}` : `Marcar suplemento ${suplemento.nome} como ingerido`}
      >
        {isTaken ? `✔ Ingerido às ${formatTime(checkin.dataHoraRealizada)}` : 'Confirmar'}
      </button>
    </motion.div>
  );
}
