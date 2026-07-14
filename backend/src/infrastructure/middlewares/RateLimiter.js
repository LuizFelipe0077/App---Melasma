/**
 * RateLimiter.js
 * In-memory rate limiting service to mitigate brute force, credential stuffing,
 * and denial-of-service attacks against the Apps Script API endpoints.
 * 
 * Security Layer: Infrastructure Middleware
 * OWASP Reference: A07:2021 – Identification and Authentication Failures
 * 
 * Architecture Note: Uses a Map-based sliding window counter.
 * When migrating to Cloud Run/Redis, replace this with a Redis-backed limiter
 * while keeping the same interface contract.
 */
import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

export class RateLimiter {
  /** @type {Map<string, { count: number, firstAttempt: number, lockedUntil: number|null }>} */
  static #attempts = new Map();

  /**
   * Checks whether a given identifier (IP, email, sessionKey) has exceeded
   * the allowed number of attempts within the configured window.
   * @param {string} identifier - Unique key (e.g., email address for login)
   * @param {number} [maxAttempts] - Maximum allowed attempts
   * @param {number} [windowMinutes] - Time window in minutes
   * @returns {{ allowed: boolean, remainingAttempts: number, lockedUntilISO: string|null }}
   */
  static check(identifier, maxAttempts = null, windowMinutes = null) {
    const max = maxAttempts ?? SystemConfiguration.MAX_LOGIN_ATTEMPTS;
    const windowMs = (windowMinutes ?? SystemConfiguration.LOGIN_LOCKOUT_MINUTES) * 60 * 1000;
    const now = Date.now();

    let record = RateLimiter.#attempts.get(identifier);

    // If no record exists, create one
    if (!record) {
      record = { count: 0, firstAttempt: now, lockedUntil: null };
      RateLimiter.#attempts.set(identifier, record);
    }

    // Check if currently locked out
    if (record.lockedUntil && now < record.lockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntilISO: new Date(record.lockedUntil).toISOString()
      };
    }

    // If lockout expired, reset
    if (record.lockedUntil && now >= record.lockedUntil) {
      record.count = 0;
      record.firstAttempt = now;
      record.lockedUntil = null;
    }

    // If window expired, reset counter
    if (now - record.firstAttempt > windowMs) {
      record.count = 0;
      record.firstAttempt = now;
    }

    const remaining = max - record.count;
    return {
      allowed: remaining > 0,
      remainingAttempts: Math.max(0, remaining),
      lockedUntilISO: null
    };
  }

  /**
   * Records a failed attempt (e.g., wrong password).
   * If max attempts exceeded, activates lockout.
   * @param {string} identifier
   * @param {number} [maxAttempts]
   * @param {number} [lockoutMinutes]
   */
  static recordFailure(identifier, maxAttempts = null, lockoutMinutes = null) {
    const max = maxAttempts ?? SystemConfiguration.MAX_LOGIN_ATTEMPTS;
    const lockMs = (lockoutMinutes ?? SystemConfiguration.LOGIN_LOCKOUT_MINUTES) * 60 * 1000;
    const now = Date.now();

    let record = RateLimiter.#attempts.get(identifier);
    if (!record) {
      record = { count: 0, firstAttempt: now, lockedUntil: null };
      RateLimiter.#attempts.set(identifier, record);
    }

    record.count += 1;

    if (record.count >= max) {
      record.lockedUntil = now + lockMs;
    }
  }

  /**
   * Resets the attempt counter on successful authentication.
   * @param {string} identifier
   */
  static recordSuccess(identifier) {
    RateLimiter.#attempts.delete(identifier);
  }

  /**
   * Clears stale entries older than the specified age (garbage collection).
   * Should be called periodically via a time-driven trigger.
   * @param {number} [maxAgeMinutes=60]
   */
  static cleanup(maxAgeMinutes = 60) {
    const cutoff = Date.now() - (maxAgeMinutes * 60 * 1000);
    for (const [key, record] of RateLimiter.#attempts.entries()) {
      if (record.firstAttempt < cutoff && (!record.lockedUntil || record.lockedUntil < Date.now())) {
        RateLimiter.#attempts.delete(key);
      }
    }
  }
}
