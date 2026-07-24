import { useState } from 'react';

const NOTE_TYPE_LABEL = {
  OBSERVACAO: 'Observação', REACAO: 'Reação', MUDANCA: 'Mudança', SOLICITACAO: 'Solicitação', RETORNO: 'Retorno',
  CONTATO: 'Contato', MUDANCA_PROTOCOLO: 'Mudança de protocolo', ORIENTACAO: 'Orientação', FEEDBACK: 'Feedback'
};

const STATUS_LABEL = { CONCLUIDO: '✔ Tomou', ATRASADO: '✔ Tomou (atrasado)', PENDENTE: '✖ Não tomou' };

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChronologicalRecord({ days }) {
  const [expandedKey, setExpandedKey] = useState(null);
  const daysWithContent = days.filter((d) => d.status !== 'future' && (d.checkins.length > 0 || d.events.length > 0));

  if (daysWithContent.length === 0) {
    return <p className="empty-state">Nenhum evento registrado no período selecionado.</p>;
  }

  return (
    <div>
      {daysWithContent.map((day) => {
        const key = day.date.toDateString();
        const isExpanded = expandedKey === key;

        return (
          <div key={key} className="record-day">
            <div
              className="timeline-day-row"
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-label={`Dia ${day.dayNumber}`}
              onClick={() => setExpandedKey(isExpanded ? null : key)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedKey(isExpanded ? null : key); } }}
            >
              <span className={`timeline-day-dot ${day.status}`} />
              <span className="timeline-day-label">
                Dia {day.dayNumber} — {day.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </span>
              {day.events.length > 0 && <span className="chip chip-warning">{day.events.length} evento(s)</span>}
              <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
            </div>

            {isExpanded && (
              <div className="timeline-day-detail animate-in">
                {day.checkins.map((c) => (
                  <div key={c.id} className="record-event">
                    <span className="record-event-icon">💊</span>
                    <span>
                      <strong className="text-ink">{c.suplemento?.nome || 'Suplemento'}</strong> — {formatTime(c.dataHoraPrescrita)}
                      {c.dataHoraRealizada && ` · check-in às ${formatTime(c.dataHoraRealizada)}`} · {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </div>
                ))}
                {day.events.map((e, idx) => (
                  <div key={idx} className="record-event">
                    {e.kind === 'nota' && (
                      <>
                        <span className="record-event-icon">📝</span>
                        <span><strong className="text-ink">{NOTE_TYPE_LABEL[e.tipo] || e.tipo}:</strong> {e.texto}</span>
                      </>
                    )}
                    {e.kind === 'permissao' && (
                      <>
                        <span className="record-event-icon">🔓</span>
                        <span>
                          Liberação retroativa concedida para o dia {new Date(e.dataLiberada).toLocaleDateString('pt-BR')}
                          {e.motivo && ` — ${e.motivo}`}
                          {e.usadaEm ? ' · utilizada' : !e.ativa ? ' · expirou sem uso' : ''}
                        </span>
                      </>
                    )}
                    {e.kind === 'quebra' && (
                      <>
                        <span className="record-event-icon">⚠️</span>
                        <span style={{ color: 'var(--danger)' }}>{e.texto}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
