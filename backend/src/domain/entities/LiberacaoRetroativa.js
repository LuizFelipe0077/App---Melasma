import { UUID } from '../valueObjects/UUID.js';

export const StatusLiberacao = {
  ATIVA: 'ATIVA',
  REVOGADA: 'REVOGADA'
};

/**
 * LiberacaoRetroativa.js
 * Domain Entity — an admin-granted authorization for a patient to register
 * check-ins for exactly one past calendar date, valid for a fixed 24h
 * window from the moment it was granted.
 */
export class LiberacaoRetroativa {
  #id;
  #pacienteId;
  #dataLiberada;
  #concedidaEm;
  #expiraEm;
  #operadorId;
  #motivo;
  #status;
  #usadaEm;

  constructor({ id, pacienteId, dataLiberada, concedidaEm, expiraEm, operadorId, motivo, status, usadaEm }) {
    if (!(id instanceof UUID)) throw new Error('ID da Liberação deve ser UUID.');
    if (!(pacienteId instanceof UUID)) throw new Error('ID do Paciente da Liberação deve ser UUID.');
    if (!(dataLiberada instanceof Date) || isNaN(dataLiberada.getTime())) throw new Error('Data liberada deve ser Date válida.');
    if (!(concedidaEm instanceof Date) || isNaN(concedidaEm.getTime())) throw new Error('Data/hora de concessão deve ser Date válida.');
    if (!(expiraEm instanceof Date) || isNaN(expiraEm.getTime())) throw new Error('Data/hora de expiração deve ser Date válida.');
    if (!operadorId || typeof operadorId !== 'string') throw new Error('ID do operador é obrigatório.');
    if (!Object.values(StatusLiberacao).includes(status)) throw new Error(`Status de Liberação inválido: ${status}`);
    if (usadaEm && (!(usadaEm instanceof Date) || isNaN(usadaEm.getTime()))) throw new Error('Data/hora de utilização deve ser Date ou null.');

    this.#id = id;
    this.#pacienteId = pacienteId;
    this.#dataLiberada = dataLiberada;
    this.#concedidaEm = concedidaEm;
    this.#expiraEm = expiraEm;
    this.#operadorId = operadorId;
    this.#motivo = motivo || '';
    this.#status = status;
    this.#usadaEm = usadaEm || null;
  }

  get id() { return this.#id; }
  get pacienteId() { return this.#pacienteId; }
  get dataLiberada() { return this.#dataLiberada; }
  get concedidaEm() { return this.#concedidaEm; }
  get expiraEm() { return this.#expiraEm; }
  get operadorId() { return this.#operadorId; }
  get motivo() { return this.#motivo; }
  get status() { return this.#status; }
  get usadaEm() { return this.#usadaEm; }

  /**
   * Whether this grant is currently usable. Always re-derived from the wall
   * clock at call time — there is no background job flipping `status` when
   * a grant ages out, so `expiraEm > now` is the real source of truth, not
   * just the stored status field.
   */
  estaAtiva(now = new Date()) {
    return this.#status === StatusLiberacao.ATIVA && this.#expiraEm.getTime() > now.getTime();
  }

  /** Whether this grant authorizes the given calendar date (exact day match, not a range). */
  abrangeData(date) {
    return this.#dataLiberada.toDateString() === date.toDateString();
  }

  /** Records first use for audit purposes. Idempotent — later calls don't overwrite the original timestamp. */
  marcarUtilizada(quando) {
    if (!this.#usadaEm) {
      this.#usadaEm = quando;
    }
  }
}
