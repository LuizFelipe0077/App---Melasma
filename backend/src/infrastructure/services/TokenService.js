/**
 * TokenService.js
 * JSON Web Token (JWT) generator and validator using native Apps Script Utilities
 * or Node.js fallbacks.
 * 
 * Security: Fail-closed design — if no crypto backend is available, token 
 * operations will throw instead of returning predictable signatures (CWE-327).
 */
export class TokenService {
  #secret;

  constructor() {
    // Read secret from script properties
    this.#secret = typeof PropertiesService !== 'undefined'
      ? PropertiesService.getScriptProperties().getProperty('JWT_SECRET')
      : process.env.JWT_SECRET;
      
    if (!this.#secret) {
      throw new Error('JWT_SECRET não configurado no ambiente.');
    }
  }

  /**
   * Generates a signed token.
   * @param {object} payload 
   * @returns {string} token
   */
  generate(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const extendedPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (120 * 60) // 2 hours expiration
    };

    const encodedHeader = this.#base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.#base64UrlEncode(JSON.stringify(extendedPayload));

    const signature = this.#hmacSha256(`${encodedHeader}.${encodedPayload}`, this.#secret);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Validates a token signature and checks expiration.
   * @param {string} token 
   * @returns {object|null} parsed payload or null if invalid
   */
  validate(token) {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const computedSignature = this.#hmacSha256(`${header}.${payload}`, this.#secret);

    if (signature !== computedSignature) {
      return null; // Signature mismatch
    }

    try {
      const decodedPayload = JSON.parse(this.#base64UrlDecode(payload));
      const nowSeconds = Math.floor(Date.now() / 1000);

      if (decodedPayload.exp && decodedPayload.exp < nowSeconds) {
        return null; // Expired
      }

      return decodedPayload;
    } catch (e) {
      return null;
    }
  }

  #base64UrlEncode(str) {
    let base64 = '';
    if (typeof Utilities !== 'undefined') {
      base64 = Utilities.base64Encode(str, Utilities.Charset.UTF_8);
    } else {
      base64 = btoa(unescape(encodeURIComponent(str)));
    }
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  #base64UrlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    if (typeof Utilities !== 'undefined') {
      const decodedBytes = Utilities.base64Decode(base64, Utilities.Charset.UTF_8);
      return Utilities.newBlob(decodedBytes).getDataAsString();
    } else {
      return decodeURIComponent(escape(atob(base64)));
    }
  }

  #base64UrlEncodeBytes(bytes) {
    let base64 = '';
    if (typeof Utilities !== 'undefined') {
      base64 = Utilities.base64Encode(bytes);
    } else {
      // Buffer to base64 for node
      base64 = Buffer.from(bytes).toString('base64');
    }
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  /**
   * Generates HMAC SHA256 signature using GAS native utilities or Node.js crypto fallback
   * @param {string} data 
   * @param {string} secret 
   * @returns {string} base64Url encoded signature
   */
  #hmacSha256(data, secret) {
    if (typeof Utilities !== 'undefined') {
      const signature = Utilities.computeHmacSha256Signature(data, secret);
      return this.#base64UrlEncodeBytes(signature);
    }
    
    // Node.js fallback for local testing (uses dynamic import to prevent GAS crash)
    if (typeof process !== 'undefined') {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(data);
      const signatureBuffer = hmac.digest();
      return this.#base64UrlEncodeBytes(signatureBuffer);
    }

    throw new Error('No cryptographic utility available.');
  }
}
export const tokenService = new TokenService();
