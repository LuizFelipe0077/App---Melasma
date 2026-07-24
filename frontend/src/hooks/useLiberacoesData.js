import { useCallback, useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Mirrors useDashboardData.js's cache/prefetch/mutate shape exactly, for
 * `listarLiberacoesRetroativasAtivas` — kept as a small parallel module
 * rather than folded into useDashboardData because the action, payload
 * shape and TTL semantics differ (this is a tiny, security-sensitive list,
 * not a 90-day-cappable dashboard range).
 *
 * Before this hook existed, RetroactiveCard and CalendarPage each ran their
 * own independent useEffect+fetch of the same action on their own mount —
 * this hook is the single source both read from, so the second one to
 * mount is a cache hit instead of a second Apps Script round-trip.
 */
const CACHE_TTL_MS = 60000;
const cache = new Map();

function isFresh(entry) {
  return !!entry && Date.now() - entry.timestamp < CACHE_TTL_MS;
}

async function fetchAndCache(pacienteId) {
  const result = await ApiClient.call('listarLiberacoesRetroativasAtivas', {});
  cache.set(pacienteId, { data: result, timestamp: Date.now() });
  return result;
}

/** Fire-and-forget background warmup — same contract as prefetchDashboard. */
export function prefetchLiberacoes(pacienteId) {
  if (isFresh(cache.get(pacienteId))) return;
  fetchAndCache(pacienteId).catch(() => {});
}

export function useLiberacoesData() {
  const { session } = useAuth();
  const pacienteId = session.userId;
  const cached = cache.get(pacienteId);

  const [data, setData] = useState(cached ? cached.data : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  const mutate = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      cache.set(pacienteId, { data: next, timestamp: Date.now() });
      return next;
    });
  }, [pacienteId]);

  useEffect(() => {
    let cancelled = false;
    const existing = cache.get(pacienteId);

    if (existing) {
      setData(existing.data);
      setLoading(false);
    } else {
      setLoading(true);
    }
    setError(null);

    if (isFresh(existing) && reloadToken === 0) {
      return () => { cancelled = true; };
    }

    fetchAndCache(pacienteId)
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
  }, [pacienteId, reloadToken]);

  return { data: data || [], loading, error, reload, mutate };
}
