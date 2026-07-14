/**
 * Email.js
 * Value Object representing a validated, immutable E-mail address.
 */
export class Email {
  #value;

  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('E-mail deve ser uma string preenchida.');
    }
    const cleanValue = value.trim().toLowerCase();
    this.#validate(cleanValue);
    this.#value = cleanValue;
    Object.freeze(this);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Endereço de e-mail inválido: ${value}`);
    }
  }

  equals(other) {
    if (!(other instanceof Email)) return false;
    return this.#value === other.value;
  }
}
