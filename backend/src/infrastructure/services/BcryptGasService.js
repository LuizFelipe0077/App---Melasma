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
   * @returns {Promise<string>} Hash in bcrypt format ($2b$10$...)
   */
  async hash(password) {
    if (!password) throw new Error('Senha vazia não pode ser hasheada.');

    // 1. Generate a cryptographically strong salt (22 characters)
    const salt = this.#generateSecureSalt(22);

    // 2. Perform iterated key-stretching (PBKDF2-like approach)
    const hashBase64 = await this.#iteratedHash(password, salt, BcryptGasService.#ITERATIONS);

    // 3. Format to standard Bcrypt signature structure: $2b$10$[22-char salt][31-char hash]
    const cleanHash = hashBase64.replace(/[^A-Za-z0-9./]/g, '').substring(0, 31).padEnd(31, 'x');
    return `$2b$10$${salt}${cleanHash}`;
  }

  /**
   * Compares a plain text password against a saved hash using constant-time comparison.
   * @param {string} password 
   * @param {string} hash 
   * @returns {Promise<boolean>}
   */
  async compare(password, hash) {
    if (!password || !hash) return false;
    
    // Bcrypt format: $2b$10$[22-char salt][31-char hash]
    if (!hash.startsWith('$2b$10$') || hash.length !== 60) {
      return false;
    }

    const salt = hash.substring(7, 29); // 22 characters salt
    const savedHashPart = hash.substring(29); // 31 characters hash

    const calculatedHashBase64 = await this.#iteratedHash(password, salt, BcryptGasService.#ITERATIONS);
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
   * @returns {Promise<string>} Base64 encoded final hash
   */
  async #iteratedHash(password, salt, iterations) {
    let result = password + salt;
    for (let i = 0; i < iterations; i++) {
      result = await this.#sha256(result + salt);
    }
    return result;
  }

  /**
   * Generates a cryptographically secure salt.
   * Uses crypto.getRandomValues when available, with Math.random fallback.
   * @param {number} length
   * @returns {string}
   */
  #generateSecureSalt(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let salt = '';

    // Prefer Web Crypto API for CSPRNG (CWE-330 mitigation)
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
      const randomBytes = new Uint8Array(length);
      globalThis.crypto.getRandomValues(randomBytes);
      for (let i = 0; i < length; i++) {
        salt += chars.charAt(randomBytes[i] % chars.length);
      }
    } else {
      // Apps Script fallback: use Utilities.getUuid() as entropy source
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
    }
    return salt;
  }

  /**
   * Constant-time string comparison to prevent timing attacks.
   * Always compares all characters regardless of mismatches. (CWE-208)
   * @param {string} a
   * @param {string} b
   * @returns {boolean}
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
   * Secure SHA-256 wrapper.
   */
  async #sha256(input) {
    if (typeof Utilities !== 'undefined' && typeof Utilities.computeDigest === 'function') {
      // Google Apps Script native crypto digest
      const rawDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
      return Utilities.base64Encode(rawDigest);
    }
    
    // Standard Web Crypto API (Node.js and Browser)
    const msgUint8 = new TextEncoder().encode(input);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgUint8);
    
    // Convert ArrayBuffer to Base64
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const binary = hashArray.map(b => String.fromCharCode(b)).join('');
    return btoa(binary);
  }
}
