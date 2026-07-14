/**
 * InputSanitizer.js
 * Centralized input sanitization utility to prevent XSS, HTML injection,
 * and Google Sheets formula injection attacks.
 * 
 * Security Layer: Shared Utility (used by Controllers and Validators)
 * OWASP Reference: A03:2021 – Injection
 */
export class InputSanitizer {

  /**
   * Sanitizes a string by escaping HTML entities.
   * Prevents XSS when values are rendered in the frontend.
   * @param {string} input - Raw user input
   * @returns {string} Sanitized string
   */
  static escapeHtml(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Prevents Google Sheets formula injection.
   * Attackers may send strings starting with =, +, -, @ or TAB
   * that execute as formulas when written to a cell.
   * @param {string} input - Raw user input
   * @returns {string} Safe string for Sheets persistence
   */
  static sanitizeForSheets(input) {
    if (typeof input !== 'string') return '';
    const trimmed = input.trim();
    // Prefix dangerous leading characters with a single quote to neutralize formula execution
    if (/^[=+\-@\t\r]/.test(trimmed)) {
      return `'${trimmed}`;
    }
    return trimmed;
  }

  /**
   * Strips all HTML tags from a string.
   * Used for fields that must never contain markup (names, addresses).
   * @param {string} input - Raw user input
   * @returns {string} Plain text
   */
  static stripTags(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Sanitizes an entire DTO object recursively.
   * Applies escapeHtml and sanitizeForSheets to all string fields.
   * @param {object} dto - Data Transfer Object with user-provided fields
   * @returns {object} Sanitized DTO
   */
  static sanitizeDTO(dto) {
    if (!dto || typeof dto !== 'object') return {};
    const sanitized = {};
    // Security: Block prototype pollution keys (CWE-1321)
    const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
    for (const [key, value] of Object.entries(dto)) {
      if (BLOCKED_KEYS.has(key)) continue;
      if (typeof value === 'string') {
        sanitized[key] = InputSanitizer.sanitizeForSheets(
          InputSanitizer.escapeHtml(
            InputSanitizer.stripTags(value)
          )
        );
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = InputSanitizer.sanitizeDTO(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Validates that a value is a safe, non-empty string within length limits.
   * @param {string} input - Raw user input
   * @param {number} maxLength - Maximum allowed character count
   * @returns {boolean}
   */
  static isValidLength(input, maxLength = 500) {
    return typeof input === 'string' && input.trim().length > 0 && input.length <= maxLength;
  }
}
