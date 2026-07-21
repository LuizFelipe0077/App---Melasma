import { SystemConfiguration } from './systemConfiguration.js';

/**
 * apiClient.js
 * HTTP client for the Google Apps Script WebApp API.
 *
 * WIRE CONTRACT (must not change — see PROJECT_ANALYSIS.md):
 *  - Single endpoint, POST only, one JSON body: { action, token, ...payload }.
 *  - Content-Type: text/plain — required to dodge GAS's CORS preflight.
 *  - Response envelope is always { statusCode, data }. GAS always answers
 *    HTTP 200, so the real result is read from the body, never response.status.
 *  - statusCode 401 means the session token is invalid/expired.
 */
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;
const pendingRequests = new Map();

async function executeCall(action, payload, retryCount) {
  const token = sessionStorage.getItem('JWT_TOKEN');
  const body = { action, token, ...payload };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(SystemConfiguration.API_BASE_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na rede: HTTP ${response.status}`);
    }

    const rawResult = await response.json();

    if (rawResult.statusCode === 401) {
      sessionStorage.removeItem('JWT_TOKEN');
      window.dispatchEvent(new CustomEvent('app:authExpired'));
      throw new Error('Sessão expirada. Redirecionando para login...');
    }

    if (rawResult.statusCode !== 200) {
      throw new Error(rawResult.data?.message || 'Erro inesperado da API.');
    }

    return rawResult.data;
  } catch (error) {
    if (
      retryCount < MAX_RETRIES &&
      (error.name === 'AbortError' || error.message.includes('Erro na rede'))
    ) {
      const delay = BASE_DELAY_MS * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return executeCall(action, payload, retryCount + 1);
    }

    if (SystemConfiguration.ENV !== 'production' && typeof console !== 'undefined') {
      console.error(`API Call failed [${action}]:`, error.message);
    }
    throw error;
  }
}

export const ApiClient = {
  async call(action, payload = {}, retryCount = 0) {
    const dedupeKey = `${action}:${JSON.stringify(payload)}`;
    if (retryCount === 0 && pendingRequests.has(dedupeKey)) {
      return pendingRequests.get(dedupeKey);
    }

    const promise = executeCall(action, payload, retryCount);

    if (retryCount === 0) {
      pendingRequests.set(dedupeKey, promise);
      promise.finally(() => pendingRequests.delete(dedupeKey));
    }

    return promise;
  },

  setApiBaseUrl(url) {
    if (url && typeof url === 'string' && url.startsWith('https://script.google.com/')) {
      const sanitized = url.trim().replace(/[<>"']/g, '');
      localStorage.setItem('API_BASE_URL', sanitized);
      SystemConfiguration.API_BASE_URL = sanitized;
      return true;
    }
    return false;
  }
};
