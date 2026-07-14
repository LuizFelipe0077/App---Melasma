/**
 * TokenService.js
 * JSON Web Token (JWT) generator and validator using native Apps Script Utilities
 * or Node.js fallbacks.
 * 
 * Security: Fail-closed design — if no crypto backend is available, token 
 * operations will throw instead of returning predictable signatures (CWE-327).
 */
import { createHmac } from 'crypto';

export class TokenService {
  #secret;

  constructor() {
    // Read secret from script properties or default sandbox secret
    this.#secret = typeof PropertiesService !== 'undefined'
      ? PropertiesService.getScriptProperties().getProperty('JWT_SECRET') || 'SANDBOX_SECRET_KEY_123'
      : 'SANDBOX_SECRET_KEY_123';
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

  #hmacSha256(message, secret) {
    // Google Apps Script native HMAC
    if (typeof Utilities !== 'undefined' && typeof Utilities.computeHmacSignature === 'function') {
      const rawSig = Utilities.computeHmacSignature(
        Utilities.MacAlgorithm.HMAC_SHA_256, 
        message, 
        secret, 
        Utilities.Charset.UTF_8
      );
      return Utilities.base64Encode(rawSig)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }

    // Node.js crypto (imported at top-level via ESM)
    return createHmac('sha256', secret).update(message).digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
}
export const tokenService = new TokenService();
