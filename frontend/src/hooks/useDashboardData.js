import { useCallback, useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps the `gerarDashboard` action. The backend caps the queryable window
 * at 90 days (see GerarDashboardUseCase) — callers must stay within that.
 *
 * Navigating Hoje -> Histórico -> Calendário each mounted a fresh fetch with
 * no memory of what was already loaded, so every page felt slow — not a
 * React problem, gerarDashboard is a real Apps Script execution (Sheets
 * read), typically 1-3s. A small in-memory, TTL'd cache keyed exactly like
 * apiClient's own in-flight dedupe key lets a page that was already visited
 * (or prefetched, see prefetchDashboard below) render instantly instead of
 * re-paying that round-trip every time.
 */
const CACHE_TTL_MS = 60000;
const cache = new Map();

function cacheKey(pacienteId, dataInicio, dataFim) {
  return `${pacienteId}:${dataInicio}:${dataFim}`;
}

function isFresh(entry) {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

async function fetchAndCache(key, pacienteId, dataInicio, dataFim) {
  const result = await ApiClient.call('gerarDashboard', { pacienteId, dataInicio, dataFim });
  cache.set(key, { data: result, timestamp: Date.now() });
  return result;
}

/**
 * Fire-and-forget background warmup — call after a page's own data has
 * already loaded, for a range another page is likely to need next. Never
 * throws, never blocks, and no-ops if that exact range is already cached
 * and still fresh.
 */
export function prefetchDashboard(pacienteId, dataInicio, dataFim) {
  const key = cacheKey(pacienteId, dataInicio, dataFim);
  if (isFresh(cache.get(key))) return;
  fetchAndCache(key, pacienteId, dataInicio, dataFim).catch(() => {});
}

export function useDashboardData(dataInicio, dataFim) {
  const { session } = useAuth();
  const key = cacheKey(session.userId, dataInicio, dataFim);
  const cached = cache.get(key);

  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  /**
   * Optimistic-update escape hatch: lets a caller write to local state
   * immediately (before the network round-trip resolves) and roll back by
   * calling it again with the previous snapshot. Accepts either a value or
   * an updater function, mirroring useState's setter contract. Also writes
   * through to the shared cache so a page navigated away from and back to
   * still reflects the optimistic value instead of the stale fetch.
   */
  const mutate = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      cache.set(key, { data: next, timestamp: Date.now() });
      return next;
    });
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    const existing = cache.get(key);

    if (existing) {
      // Instant paint from cache — no loading flash — even if it's stale
      // enough to also revalidate in the background right after.
      setData(existing.data);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    if (isFresh(existing) && reloadToken === 0) {
      return () => { cancelled = true; };
    }

    fetchAndCache(key, session.userId, dataInicio, dataFim)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled && !existing) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session.userId, dataInicio, dataFim, reloadToken, key]);

  return { data, loading, error, reload, mutate };
}
