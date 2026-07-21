import { UUID } from '../valueObjects/UUID.js';
import { StatusCheckin } from './CheckIn.js';

/**
 * Gamificacao.js
 * Domain Entity representing a patient's gamification stats and accomplishments.
 */
export class Gamificacao {
  #id;
  #pacienteId;
  #xpTotal;
  #streakAtual;
  #maiorStreak;
  #conquistas; // Array of strings (achievement IDs/slugs)

  constructor({ id, pacienteId, xpTotal, streakAtual, maiorStreak, conquistas }) {
    if (!(id instanceof UUID)) throw new Error('ID da Gamificação deve ser UUID.');
    if (!(pacienteId instanceof UUID)) throw new Error('ID do Paciente deve ser UUID.');
    
    this.#id = id;
    this.#pacienteId = pacienteId;
    this.#xpTotal = Number.isInteger(xpTotal) ? xpTotal : 0;
    this.#streakAtual = Number.isInteger(streakAtual) ? streakAtual : 0;
    this.#maiorStreak = Number.isInteger(maiorStreak) ? maiorStreak : 0;
    this.#conquistas = Array.isArray(conquistas) ? [...conquistas] : [];
  }

  get id() { return this.#id; }
  get pacienteId() { return this.#pacienteId; }
  get xpTotal() { return this.#xpTotal; }
  get streakAtual() { return this.#streakAtual; }
  get maiorStreak() { return this.#maiorStreak; }
  get conquistas() { return this.#conquistas; }

  get nivel() {
    // Basic level calculation: Level = Math.floor(XP / 100) + 1
    return Math.floor(this.#xpTotal / 100) + 1;
  }

  /**
   * Awards XP based on the check-in status.
   */
  creditarCheckin(statusCheckin) {
    if (statusCheckin === StatusCheckin.CONCLUIDO) {
      this.#xpTotal += 10;
    } else if (statusCheckin === StatusCheckin.ATRASADO) {
      this.#xpTotal += 5;
    }
    
    // Check if new achievements are unlocked by XP thresholds
    this.#verificarConquistasXp();
  }

  /**
   * Reverses the XP awarded for a check-in (mirrors creditarCheckin), used
   * when a check-in is cancelled. Floors at 0 — never goes negative.
   */
  debitarCheckin(statusCheckin) {
    if (statusCheckin === StatusCheckin.CONCLUIDO) {
      this.#xpTotal = Math.max(0, this.#xpTotal - 10);
    } else if (statusCheckin === StatusCheckin.ATRASADO) {
      this.#xpTotal = Math.max(0, this.#xpTotal - 5);
    }
  }

  decrementarStreak() {
    this.#streakAtual = Math.max(0, this.#streakAtual - 1);
  }

  incrementarStreak() {
    this.#streakAtual++;
    if (this.#streakAtual > this.#maiorStreak) {
      this.#maiorStreak = this.#streakAtual;
    }
    this.#verificarConquistasStreak();
  }

  resetarStreak() {
    this.#streakAtual = 0;
  }

  concederConquista(conquistaSlug) {
    if (!this.#conquistas.includes(conquistaSlug)) {
      this.#conquistas.push(conquistaSlug);
    }
  }

  #verificarConquistasXp() {
    if (this.#xpTotal >= 100 && !this.#conquistas.includes('nivel_1_alcance')) {
      this.concederConquista('nivel_1_alcance');
    }
    if (this.#xpTotal >= 500) this.concederConquista('consistencia_prata');
    if (this.#xpTotal >= 1000) this.concederConquista('consistencia_ouro');
  }

  #verificarConquistasStreak() {
    if (this.#streakAtual >= 7) this.concederConquista('streak_semanal');
    if (this.#streakAtual >= 30) this.concederConquista('streak_mensal');
  }
}
