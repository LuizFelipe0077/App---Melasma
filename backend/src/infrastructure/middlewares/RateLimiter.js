/**
 * RateLimiter.js
 * Proteção contra ataques de força bruta, scraping e DoS.
 * Módulo 20: Reimplementado usando CacheService para persistência entre execuções no GAS.
 */
import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

export class RateLimiter {
  static #PREFIX = 'RATE_LIMIT_';
  static #MAX_ATTEMPTS = SystemConfiguration.MAX_LOGIN_ATTEMPTS || 5;
  static #LOCKOUT_MINUTES = SystemConfiguration.LOGIN_LOCKOUT_MINUTES || 15;

  /**
   * Verifica se uma chave pode realizar uma ação.
   * @param {string} key - Identificador único (IP, email, sessão)
   * @returns {object} { allowed: boolean, remaining: number, lockedUntilISO?: string }
   */
  static check(key) {
    if (!key) return { allowed: true, remaining: this.#MAX_ATTEMPTS };

    const cache = RateLimiter.#getCache();
    if (!cache) return { allowed: true, remaining: this.#MAX_ATTEMPTS };

    const cacheKey = `${this.#PREFIX}${key}`;
    const recordStr = cache.get(cacheKey);

    if (recordStr) {
      try {
        const record = JSON.parse(recordStr);
        if (record.lockedUntil) {
          const now = Date.now();
          if (now < record.lockedUntil) {
            return {
              allowed: false,
              remaining: 0,
              lockedUntilISO: new Date(record.lockedUntil).toISOString()
            };
          } else {
            // Lock expired, reset
            cache.remove(cacheKey);
            return { allowed: true, remaining: this.#MAX_ATTEMPTS };
          }
        }

        if (record.failures >= this.#MAX_ATTEMPTS) {
          // Should have been locked, enforce lock
          const lockedUntil = Date.now() + (this.#LOCKOUT_MINUTES * 60 * 1000);
          record.lockedUntil = lockedUntil;
          cache.put(cacheKey, JSON.stringify(record), this.#LOCKOUT_MINUTES * 60);
          
          return {
            allowed: false,
            remaining: 0,
            lockedUntilISO: new Date(lockedUntil).toISOString()
          };
        }

        return {
          allowed: true,
          remaining: Math.max(0, this.#MAX_ATTEMPTS - record.failures)
        };
      } catch (e) {
        // Parse error, reset
      }
    }

    return { allowed: true, remaining: this.#MAX_ATTEMPTS };
  }

  /**
   * Registra uma falha associada à chave. Incrementa as falhas.
   * @param {string} key 
   */
  static recordFailure(key) {
    if (!key) return;

    const cache = RateLimiter.#getCache();
    if (!cache) return;

    const cacheKey = `${this.#PREFIX}${key}`;
    const recordStr = cache.get(cacheKey);
    let record = { failures: 0 };

    if (recordStr) {
      try {
        record = JSON.parse(recordStr);
      } catch (e) {}
    }

    record.failures += 1;

    if (record.failures >= this.#MAX_ATTEMPTS) {
      record.lockedUntil = Date.now() + (this.#LOCKOUT_MINUTES * 60 * 1000);
    }

    // Keep record in cache for at least lockout time + some buffer
    const cacheTimeSecs = (this.#LOCKOUT_MINUTES * 60) + 300;
    cache.put(cacheKey, JSON.stringify(record), cacheTimeSecs);
  }

  /**
   * Reseta o contador após sucesso, limpando a chave no CacheService.
   * @param {string} key 
   */
  static recordSuccess(key) {
    if (!key) return;
    const cache = RateLimiter.#getCache();
    if (cache) {
      cache.remove(`${this.#PREFIX}${key}`);
    }
  }

  static #getCache() {
    return typeof CacheService !== 'undefined' ? CacheService.getScriptCache() : null;
  }
}
