/**
 * CheckinRealizadoEvent.js
 * Domain Event triggered when a patient completes a check-in.
 */
export class CheckinRealizadoEvent {
  #checkin;
  #occurredOn;

  constructor(checkin) {
    this.#checkin = checkin;
    this.#occurredOn = new Date();
  }

  get checkin() { return this.#checkin; }
  get occurredOn() { return this.#occurredOn; }
}
