import { useCallback, useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wraps the `gerarDashboard` action. The backend caps the queryable window
 * at 90 days (see GerarDashboardUseCase) — callers must stay within that.
 */
export function useDashboardData(dataInicio, dataFim) {
  const { session } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  /**
   * Optimistic-update escape hatch: lets a caller write to local state
   * immediately (before the network round-trip resolves) and roll back by
   * calling it again with the previous snapshot. Accepts either a value or
   * an updater function, mirroring useState's setter contract.
   */
  const mutate = useCallback((updater) => {
    setData((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    ApiClient.call('gerarDashboard', {
      pacienteId: session.userId,
      dataInicio,
      dataFim
    })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session.userId, dataInicio, dataFim, reloadToken]);

  return { data, loading, error, reload, mutate };
}
