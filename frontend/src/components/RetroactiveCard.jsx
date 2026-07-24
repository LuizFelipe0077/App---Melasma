import { useEffect, useState } from 'react';
import RetroactiveCheckinSheet from './RetroactiveCheckinSheet.jsx';
import { useLiberacoesData } from '../hooks/useLiberacoesData.js';
import { computeHmCountdown } from '../utils/countdown.js';

/** One collapsible entry — its own countdown, its own Sheet, hides itself independently once expired. */
function LiberacaoEntry({ liberacao, defaultOpen }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [countdown, setCountdown] = useState(() => computeHmCountdown(liberacao.expiraEm));
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setCountdown(computeHmCountdown(liberacao.expiraEm)), 60000);
    return () => clearInterval(id);
  }, [liberacao.expiraEm]);

  if (!countdown) return null;

  const dataLabel = new Date(liberacao.dataLiberada).toLocaleDateString('pt-BR');

  return (
    <div className="retroactive-entry">
      <button type="button" className="retroactive-entry-header" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        <span className="retroactive-entry-date">{dataLabel}</span>
        <span aria-hidden="true">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="retroactive-entry-body animate-in">
          <p className="body-sm" style={{ marginBottom: 'var(--space-3)' }}>
            Essa autorização expira em: <span className="retroactive-card-countdown">{countdown.hours}h {countdown.minutes}min</span>
          </p>
          <button className="btn btn-fill" onClick={() => setSheetOpen(true)}>Registrar</button>
        </div>
      )}

      <RetroactiveCheckinSheet open={sheetOpen} dataLiberada={liberacao.dataLiberada} onClose={() => setSheetOpen(false)} />
    </div>
  );
}

/**
 * Premium banner shown at the top of the patient dashboard listing every
 * currently active retroactive-release grant — a patient can have several
 * simultaneously (different dates, each expiring independently). Reads
 * from the shared useLiberacoesData cache (warmed by PatientDashboardPage's
 * mount), so no fetch of its own on remount.
 */
export default function RetroactiveCard() {
  const { data: liberacoes } = useLiberacoesData();

  if (!liberacoes || liberacoes.length === 0) return null;

  return (
    <div className="retroactive-card">
      <div className="retroactive-card-title">
        <span aria-hidden="true">🔓</span>
        <span>{liberacoes.length === 1 ? 'Retroativo disponível' : 'Retroativos disponíveis'}</span>
      </div>
      {liberacoes.length === 1 ? (
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)' }}>
          Você recebeu autorização para registrar os suplementos do dia: <strong className="text-ink">{new Date(liberacoes[0].dataLiberada).toLocaleDateString('pt-BR')}</strong>
        </p>
      ) : (
        <p className="body-sm" style={{ marginBottom: 'var(--space-3)' }}>
          Você recebeu autorização para registrar os suplementos de {liberacoes.length} dias diferentes.
        </p>
      )}
      {liberacoes.map((liberacao, idx) => (
        <LiberacaoEntry key={liberacao.id} liberacao={liberacao} defaultOpen={idx === 0} />
      ))}
    </div>
  );
}
