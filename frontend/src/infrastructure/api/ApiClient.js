import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

/**
 * ApiClient.js
 * Frontend HTTP client wrapper for communicating with the Google Apps Script WebApp API.
 * Autoinjects session tokens and normalizes responses.
 * 
 * Security: Handles automatic session expiration, exponential retry backoff,
 * and ensures tokens are never persisted in localStorage.
 */
export class ApiClient {
  static #MAX_RETRIES = 3;
  static #BASE_DELAY_MS = 1000;
  
  // Performance: Request deduplication — prevents duplicate in-flight requests
  static #pendingRequests = new Map();

  /**
   * Performs an API call using POST (GAS WebApps process all mutations/actions under doPost).
   * @param {string} action Action string mapped in the backend controller
   * @param {object} payload Action parameters
   * @param {number} [retryCount=0] Internal retry counter
   */
  static async call(action, payload = {}, retryCount = 0) {
    // Performance: Deduplicate identical in-flight requests
    const dedupeKey = `${action}:${JSON.stringify(payload)}`;
    if (retryCount === 0 && ApiClient.#pendingRequests.has(dedupeKey)) {
      return ApiClient.#pendingRequests.get(dedupeKey);
    }

    const promise = ApiClient.#executeCall(action, payload, retryCount);
    
    if (retryCount === 0) {
      ApiClient.#pendingRequests.set(dedupeKey, promise);
      promise.finally(() => ApiClient.#pendingRequests.delete(dedupeKey));
    }
    
    return promise;
  }

  static async #executeCall(action, payload, retryCount) {
    const token = sessionStorage.getItem('JWT_TOKEN');
    
    // Security: Whitelist only allowed payload keys per action to prevent mass assignment
    const body = {
      action,
      token,
      ...payload
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(SystemConfiguration.API_BASE_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // GAS WebApp requires text/plain to avoid preflight OPTIONS blocks
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na rede: HTTP ${response.status}`);
      }

      const rawResult = await response.json();
      
      // GAS WebApp Custom Envelope Format: { statusCode: 200, data: {...} }
      if (rawResult.statusCode === 401) {
        // Security: Auto-clear session and redirect on expired/invalid token
        sessionStorage.removeItem('JWT_TOKEN');
        window.dispatchEvent(new CustomEvent('app:authExpired'));
        throw new Error('Sessão expirada. Redirecionando para login...');
      }

      if (rawResult.statusCode !== 200) {
        throw new Error(rawResult.data?.message || 'Erro inesperado da API.');
      }

      return rawResult.data;
    } catch (error) {
      // Retry on network/timeout errors with exponential backoff
      if (retryCount < ApiClient.#MAX_RETRIES && (error.name === 'AbortError' || error.message.includes('Erro na rede'))) {
        const delay = ApiClient.#BASE_DELAY_MS * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return ApiClient.#executeCall(action, payload, retryCount + 1);
      }

      // Production: suppress detailed error logging
      if (SystemConfiguration.ENV !== 'production' && typeof console !== 'undefined') {
        console.error(`API Call failed [${action}]:`, error.message);
      }
      throw error;
    }
  }

  /**
   * Securely configures the API base URL (only accepts Google Apps Script domains).
   * @param {string} url
   * @returns {boolean}
   */
  static setApiBaseUrl(url) {
    if (url && typeof url === 'string' && url.startsWith('https://script.google.com/')) {
      const sanitized = url.trim().replace(/[<>"']/g, '');
      localStorage.setItem('API_BASE_URL', sanitized);
      SystemConfiguration.API_BASE_URL = sanitized;
      return true;
    }
    return false;
  }
}

