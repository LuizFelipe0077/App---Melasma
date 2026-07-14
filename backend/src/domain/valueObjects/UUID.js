/**
 * UUID.js
 * Value Object representing a validated UUID (v4).
 */
export class UUID {
  #value;

  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('UUID deve ser uma string preenchida.');
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
    if (!uuidRegex.test(value)) {
      throw new Error(`UUID v4 inválido: ${value}`);
    }
  }

  equals(other) {
    if (!(other instanceof UUID)) return false;
    return this.#value === other.value;
  }

  /**
   * Generates a new random UUID v4 using the crypto API (fallback to math.random if not in browser/node environment).
   */
  static generate() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return new UUID(crypto.randomUUID());
    }
    // Apps Script / fallback generator
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    const uuid = `${s4()}${s4()}-${s4()}-4${s4().substring(1)}-${((Math.floor(Math.random() * 4) + 8) * 0x1000).toString(16).substring(1)}-${s4()}${s4()}${s4()}`;
    return new UUID(uuid);
  }
}
