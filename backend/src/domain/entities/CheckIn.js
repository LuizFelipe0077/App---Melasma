import { UUID } from '../valueObjects/UUID.js';

export const StatusCheckin = {
  CONCLUIDO: 'CONCLUIDO',
  ATRASADO: 'ATRASADO',
  PENDENTE: 'PENDENTE'
};

/**
 * CheckIn.js
 * Domain Entity representing a log of ingestion.
 */
export class CheckIn {
  #id;
  #pacienteId;
  #suplementoId;
  #dataHoraPrescrita;
  #dataHoraRealizada;
  #status;
  #retroativo;

  constructor({ id, pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada, status, retroativo }) {
    if (!(id instanceof UUID)) throw new Error('ID do Check-in deve ser UUID.');
    if (!(pacienteId instanceof UUID)) throw new Error('ID do Paciente do Check-in deve ser UUID.');
    if (!(suplementoId instanceof UUID)) throw new Error('ID do Suplemento do Check-in deve ser UUID.');
    
    if (!(dataHoraPrescrita instanceof Date)) {
      throw new Error('Data hora prescrita deve ser Date.');
    }

    if (dataHoraRealizada && !(dataHoraRealizada instanceof Date)) {
      throw new Error('Data hora realizada deve ser Date ou null.');
    }

    if (!Object.values(StatusCheckin).includes(status)) {
      throw new Error(`Status de Check-in inválido: ${status}`);
    }

    this.#id = id;
    this.#pacienteId = pacienteId;
    this.#suplementoId = suplementoId;
    this.#dataHoraPrescrita = dataHoraPrescrita;
    this.#dataHoraRealizada = dataHoraRealizada || null;
    this.#status = status;
    this.#retroativo = !!retroativo;
  }

  get id() { return this.#id; }
  get pacienteId() { return this.#pacienteId; }
  get suplementoId() { return this.#suplementoId; }
  get dataHoraPrescrita() { return this.#dataHoraPrescrita; }
  get dataHoraRealizada() { return this.#dataHoraRealizada; }
  get status() { return this.#status; }
  get retroativo() { return this.#retroativo; }

  /**
   * Performs the ingestion confirmation, checking whether it falls within the tolerance window.
   * @param {Date} realTime 
   * @param {number} toleranceMinutes 
   * @param {boolean} forceRetroactive 
   */
  confirmIngestion(realTime, toleranceMinutes = 60, forceRetroactive = false) {
    if (this.#status !== StatusCheckin.PENDENTE) {
      throw new Error('Check-in já foi realizado anteriormente.');
    }

    this.#dataHoraRealizada = realTime;
    this.#retroativo = forceRetroactive;

    if (forceRetroactive) {
      this.#status = StatusCheckin.ATRASADO;
      return;
    }

    // Calculando diferença absoluta em minutos
    const diffMs = Math.abs(realTime.getTime() - this.#dataHoraPrescrita.getTime());
    const diffMinutes = Math.floor(diffMs / 1000 / 60);

    if (diffMinutes <= toleranceMinutes) {
      this.#status = StatusCheckin.CONCLUIDO;
    } else {
      this.#status = StatusCheckin.ATRASADO;
    }
  }

  revert() {
    this.#dataHoraRealizada = null;
    this.#status = StatusCheckin.PENDENTE;
    this.#retroativo = false;
  }
}
