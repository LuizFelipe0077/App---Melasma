/**
 * CardSuplemento.js
 * Renders a premium interactive card for a supplement dosage.
 * Adheres to accessibility requirements and provides dynamic haptic feedback triggers.
 */
export class CardSuplemento {
  static render(suplemento, checkin, onCheckinClick, onUndoClick) {
    const isTaken = checkin && checkin.status !== 'PENDENTE';
    const statusText = isTaken 
      ? `Ingerido às ${new Date(checkin.dataHoraRealizada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` 
      : 'Pendente';
    
    const cardId = `sup-card-${suplemento.id}-${checkin ? checkin.dataHoraPrescrita : 'today'}`;

    const cardHtml = `
      <div id="${cardId}" class="supplement-card ${isTaken ? 'taken' : 'pending'}" role="group" aria-label="Suplemento ${suplemento.nome}">
        <div class="card-left">
          <div class="time-badge">${checkin ? new Date(checkin.dataHoraPrescrita).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Hora'}</div>
          <div class="supplement-details">
            <h3 class="supplement-title">${suplemento.nome}</h3>
            <p class="supplement-dosage">${suplemento.dosagem}</p>
            ${suplemento.instrucoes ? `<p class="supplement-instructions">💡 ${suplemento.instrucoes}</p>` : ''}
          </div>
        </div>
        <div class="card-right">
          ${isTaken 
            ? `<button class="btn-check taken clickable" aria-label="Desfazer ingestão do suplemento ${suplemento.nome}">
                 <span class="status-indicator">✔ Ingerido</span>
               </button>` 
            : `<button class="btn-check pending clickable" aria-label="Marcar suplemento ${suplemento.nome} como ingerido">
                 <span class="status-indicator">Confirmar</span>
               </button>`
          }
        </div>
      </div>
    `;

    // Delay binding until elements are inserted to the DOM by returning HTML + dynamic setup binder.
    const bindEvents = () => {
      const card = document.getElementById(cardId);
      if (!card) return;

      const btn = card.querySelector('.btn-check');
      btn.addEventListener('click', async () => {
        if (!isTaken) {
          // Play click animation
          card.classList.add('checking');
          
          // Trigger Haptic feedback if available (Apple/Android style)
          if (navigator.vibrate) {
            navigator.vibrate(80); // Light short vibration
          }

          // Trigger soft audio feedback
          playSoftChime();

          setTimeout(() => {
            onCheckinClick(suplemento, checkin);
          }, 300);
        } else {
          // Open undo verification (Toast with 4s timeout or immediate trigger)
          onUndoClick(suplemento, checkin);
        }
      });
    };

    return { html: cardHtml, bindEvents };
  }
}

/**
 * Performance: Shared AudioContext singleton.
 * Creating a new AudioContext per click wastes memory and triggers GC.
 * The singleton is created lazily on first interaction and reused.
 */
let sharedAudioCtx = null;

function getAudioContext() {
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    sharedAudioCtx = new AudioContextClass();
  }
  // Resume if suspended (browsers suspend AudioContext until user gesture)
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

/**
 * Emits a high-frequency, non-intrusive soft sound chime on check-in confirmation
 */
function playSoftChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // browser blocked audio or not supported
  }
}
