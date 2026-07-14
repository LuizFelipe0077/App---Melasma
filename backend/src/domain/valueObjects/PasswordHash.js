/**
 * PasswordHash.js
 * Value Object representing a validated Bcrypt password hash.
 */
export class PasswordHash {
  #value;

  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('Hash de senha deve ser uma string preenchida.');
    }
    this.#validate(value);
    this.#value = value;
    Object.freeze(this);
  }

  get value() {
    return this.#value;
  }

  #validate(value) {
    // Bcrypt hashes are 60 characters long and start with $2a$, $2b$, or $2y$
    const bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
    if (!bcryptRegex.test(value)) {
      throw new Error('Formato de hash de senha inválido para Bcrypt.');
    }
  }

  equals(other) {
    if (!(other instanceof PasswordHash)) return false;
    return this.#value === other.value;
  }
}
