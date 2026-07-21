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

  return { data, loading, error, reload };
}
