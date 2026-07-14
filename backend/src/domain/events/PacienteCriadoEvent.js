/**
 * PacienteCriadoEvent.js
 * Domain Event triggered when a new Paciente is registered.
 */
export class PacienteCriadoEvent {
  #paciente;
  #senhaTemporaria;
  #occurredOn;

  constructor(paciente, senhaTemporaria) {
    this.#paciente = paciente;
    this.#senhaTemporaria = senhaTemporaria;
    this.#occurredOn = new Date();
  }

  get paciente() { return this.#paciente; }
  get senhaTemporaria() { return this.#senhaTemporaria; }
  get occurredOn() { return this.#occurredOn; }
}
