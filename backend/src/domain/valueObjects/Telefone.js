/**
 * Telefone.js
 * Value Object representing a validated telephone/mobile number.
 */
export class Telefone {
  #value;

  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Telefone deve ser uma string preenchida.');
    }
    const cleanValue = value.replace(/\s+/g, ''); // strip spaces
    this.#validate(cleanValue);
    this.#value = cleanValue;
    Object.freeze(this);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    // Regex for DDI + DDD + Number, allowing digits, dashes and parentheses.
    // Normalized check: must have at least 10 digits.
    const numericOnly = value.replace(/\D/g, '');
    if (numericOnly.length < 10 || numericOnly.length > 15) {
      throw new Error(`Número de telefone inválido: ${value}`);
    }
  }

  equals(other) {
    if (!(other instanceof Telefone)) return false;
    return this.#value.replace(/\D/g, '') === other.value.replace(/\D/g, '');
  }
}
