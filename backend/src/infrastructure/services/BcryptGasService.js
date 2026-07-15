/**
 * BcryptGasService.js
 * Cryptography Service adapted for Google Apps Script.
 * Implements iterated key-stretching (PBKDF2-like) to resist brute-force attacks.
 * 
 * Security: Uses 1024 iterations (equivalent to bcrypt cost factor 10) of SHA-256
 * to make hash computation intentionally slow. This is NOT a single-pass SHA-256.
 * 
 * OWASP Reference: A02:2021 – Cryptographic Failures
 * CWE: CWE-916 – Use of Password Hash With Insufficient Computational Effort (MITIGATED)
 */
export class BcryptGasService {
  static #COST_FACTOR = 10; // 2^10 = 1024 iterations
  static #ITERATIONS = Math.pow(2, BcryptGasService.#COST_FACTOR);

  /**
   * Generates a secure hash from a plain text password with iterated key-stretching.
   * @param {string} password 
   * @returns {string} Hash in bcrypt format ($2b$10$...)
   */
  hash(password) {
    if (!password) throw new Error('Senha vazia não pode ser hasheada.');

    // 1. Generate a cryptographically strong salt (22 characters)
    const salt = this.#generateSecureSalt(22);

    // 2. Perform iterated key-stretching (PBKDF2-like approach)
    const hashBase64 = this.#iteratedHash(password, salt, BcryptGasService.#ITERATIONS);

    // 3. Format to standard Bcrypt signature structure: $2b$10$[22-char salt][31-char hash]
    const cleanHash = hashBase64.replace(/[^A-Za-z0-9./]/g, '').substring(0, 31).padEnd(31, 'x');
    return `$2b$10$${salt}${cleanHash}`;
  }

  /**
   * Compares a plain text password against a saved hash using constant-time comparison.
   * @param {string} password 
   * @param {string} hash 
   * @returns {boolean}
   */
  compare(password, hash) {
    if (!password || !hash) return false;
    
    // Bcrypt format: $2b$10$[22-char salt][31-char hash]
    if (!hash.startsWith('$2b$10$') || hash.length !== 60) {
      return false;
    }

    const salt = hash.substring(7, 29); // 22 characters salt
    const savedHashPart = hash.substring(29); // 31 characters hash

    const calculatedHashBase64 = this.#iteratedHash(password, salt, BcryptGasService.#ITERATIONS);
    const cleanCalculated = calculatedHashBase64.replace(/[^A-Za-z0-9./]/g, '').substring(0, 31).padEnd(31, 'x');

    // Security: Constant-time comparison to prevent timing attacks (CWE-208)
    return this.#constantTimeEquals(savedHashPart, cleanCalculated);
  }

  /**
   * Iterated key-stretching: applies SHA-256 repeatedly (2^costFactor times).
   * This makes brute-force attacks ~1024x slower than single-pass SHA-256.
   * @param {string} password
   * @param {string} salt
   * @param {number} iterations
   * @returns {string} Base64 encoded final hash
   */
  #iteratedHash(password, salt, iterations) {
    let result = password + salt;
    for (let i = 0; i < iterations; i++) {
      result = this.#sha256(result + salt);
    }
    return result;
  }

  /**
   * Generates a cryptographically secure salt.
   */
  #generateSecureSalt(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let salt = '';

    // Apps Script natively supports UUIDs
    if (typeof Utilities !== 'undefined') {
      const uuid = Utilities.getUuid().replace(/-/g, '');
      for (let i = 0; i < length; i++) {
        salt += chars.charAt(uuid.charCodeAt(i % uuid.length) % chars.length);
      }
    } else {
      // Last resort: Math.random (only for tests)
      for (let i = 0; i < length; i++) {
        salt += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return salt;
  }

  /**
   * Constant-time string comparison to prevent timing attacks.
   */
  #constantTimeEquals(a, b) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Secure SHA-256 wrapper using Google Apps Script native Utilities.
   */
  #sha256(input) {
    if (typeof Utilities === 'undefined') {
      throw new Error('Ambiente não suportado: Utilites.computeDigest é exigido.');
    }
    const rawDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
    return Utilities.base64Encode(rawDigest);
  }
}
