import { useState } from 'react';

const STATUS_LABEL = { CONCLUIDO: '✔ Tomou', ATRASADO: '✔ Tomou (atrasado)', PENDENTE: '✖ Não tomou' };

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Timeline({ days }) {
  const [expandedKey, setExpandedKey] = useState(null);

  return (
    <div>
      {days.map((day) => {
        const key = day.date.toDateString();
        const isExpanded = expandedKey === key;
        const canExpand = day.status !== 'future';

        return (
          <div key={key}>
            <div
              className="timeline-day-row"
              onClick={() => canExpand && setExpandedKey(isExpanded ? null : key)}
              style={{ cursor: canExpand ? 'pointer' : 'default', opacity: day.status === 'future' ? 0.5 : 1 }}
            >
              <span className={`timeline-day-dot ${day.status}`} />
              <span className="timeline-day-label">
                Dia {day.dayNumber} — {day.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </span>
              {day.checkins.length > 0 && (
                <span className="dose-meta">{day.checkins.filter((c) => c.status !== 'PENDENTE').length}/{day.checkins.length} doses</span>
              )}
              {canExpand && <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>}
            </div>

            {isExpanded && (
              <div className="timeline-day-detail animate-in">
                {day.checkins.length === 0 ? (
                  <p className="body-sm">Nenhum suplemento registrado neste dia.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {day.checkins.map((c) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <div>
                          <div className="dose-name">{c.suplemento?.nome || 'Suplemento'}</div>
                          <div className="dose-meta">
                            {formatTime(c.dataHoraPrescrita)}
                            {c.dataHoraRealizada && ` · check-in às ${formatTime(c.dataHoraRealizada)}`}
                          </div>
                        </div>
                        <span className={`chip ${c.status === 'PENDENTE' ? 'chip-danger' : c.status === 'ATRASADO' ? 'chip-warning' : 'chip-success'}`}>
                          {STATUS_LABEL[c.status] || c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
