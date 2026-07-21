import { useState } from 'react';

let sharedAudioCtx = null;
function playChime() {
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
    gain.gain.setValueAtTime(0.07, sharedAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    osc.start();
    osc.stop(sharedAudioCtx.currentTime + 0.25);
  } catch {
    // audio blocked/unsupported — silent no-op
  }
}

const formatTime = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function DoseTimelineItem({ suplemento, checkin, onCheck, onUndo }) {
  const [checking, setChecking] = useState(false);
  const isDone = checkin && checkin.status !== 'PENDENTE';

  const handleClick = () => {
    if (isDone) {
      onUndo(suplemento, checkin);
      return;
    }
    setChecking(true);
    if (navigator.vibrate) navigator.vibrate(70);
    playChime();
    setTimeout(() => {
      onCheck(suplemento, checkin);
      setChecking(false);
    }, 260);
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
        <button
          className={`dose-check${isDone ? ' done' : ''}`}
          onClick={handleClick}
          aria-label={isDone ? `Desfazer ${suplemento.nome}` : `Marcar ${suplemento.nome} como tomado`}
        >
          {isDone ? '✓' : ''}
        </button>
      </div>
    </div>
  );
}
