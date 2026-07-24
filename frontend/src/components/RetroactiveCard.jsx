import { useEffect, useState } from 'react';
import { ApiClient } from '../api/apiClient.js';
import RetroactiveCheckinSheet from './RetroactiveCheckinSheet.jsx';
import { computeHmCountdown } from '../utils/countdown.js';

/**
 * Premium banner shown at the top of the patient dashboard when there is an
 * active retroactive-release grant. Fetches once on mount; the countdown
 * itself is derived client-side every tick from the already-fetched
 * `expiraEm` — no repeated polling needed, and the card hides itself the
 * instant the countdown reaches zero.
 */
export default function RetroactiveCard() {
  const [liberacao, setLiberacao] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    ApiClient.call('obterLiberacaoRetroativaAtiva', {})
      .then((result) => {
        setLiberacao(result);
        if (result) setCountdown(computeHmCountdown(result.expiraEm));
      })
      .catch(() => setLiberacao(null));
  }, []);

  useEffect(() => {
    if (!liberacao) return undefined;
    const id = setInterval(() => setCountdown(computeHmCountdown(liberacao.expiraEm)), 60000);
    return () => clearInterval(id);
  }, [liberacao]);

  if (!liberacao || !countdown) return null;

  const dataLabel = new Date(liberacao.dataLiberada).toLocaleDateString('pt-BR');

  return (
    <>
      <div className="retroactive-card">
        <div className="retroactive-card-title">
          <span aria-hidden="true">🔓</span>
          <span>Retroativo disponível</span>
        </div>
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)' }}>
          Você recebeu autorização para registrar os suplementos do dia: <strong className="text-ink">{dataLabel}</strong>
        </p>
        <p className="body-sm" style={{ marginBottom: 'var(--space-4)' }}>
          Essa autorização expira em: <span className="retroactive-card-countdown">{countdown.hours}h {countdown.minutes}min</span>
        </p>
        <button className="btn btn-fill" onClick={() => setSheetOpen(true)}>Registrar Retroativo</button>
      </div>

      <RetroactiveCheckinSheet open={sheetOpen} dataLiberada={liberacao.dataLiberada} onClose={() => setSheetOpen(false)} />
    </>
  );
}
