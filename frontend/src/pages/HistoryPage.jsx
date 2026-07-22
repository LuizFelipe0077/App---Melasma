import { useMemo, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData.js';

const RANGE_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' } // backend hard-caps the window at 90 days (GerarDashboardUseCase)
];

const STATUS_TONE = { CONCLUIDO: 'chip-success', ATRASADO: 'chip-warning', PENDENTE: '' };
const STATUS_LABEL = { CONCLUIDO: 'Concluído', ATRASADO: 'Atrasado', PENDENTE: 'Pendente' };

function groupByDay(rawCheckins, suplementosById) {
  const groups = new Map();
  for (const c of rawCheckins) {
    const day = new Date(c.dataHoraPrescrita).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push({ ...c, suplemento: suplementosById.get(c.suplementoId) });
  }
  return Array.from(groups.entries());
}

export default function HistoryPage() {
  const [rangeDays, setRangeDays] = useState(30);

  const { dataInicio, dataFim } = useMemo(() => {
    const today = new Date();
    return {
      dataInicio: new Date(today.getFullYear(), today.getMonth(), today.getDate() - rangeDays).toISOString(),
      dataFim: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
    };
  }, [rangeDays]);

  const { data, loading, error } = useDashboardData(dataInicio, dataFim);

  const suplementosById = useMemo(() => {
    const map = new Map();
    (data?.historicoAgrupadoPorSuplemento || []).forEach((s) => map.set(s.suplementoId, s));
    return map;
  }, [data]);

  const grouped = useMemo(() => {
    const raw = [...(data?.rawCheckins || [])].sort((a, b) => new Date(b.dataHoraPrescrita) - new Date(a.dataHoraPrescrita));
    return groupByDay(raw, suplementosById);
  }, [data, suplementosById]);

  return (
    <>
      <div className="flex items-center justify-between mobile-stack-center" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <h1 className="display-md">Histórico</h1>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              className={rangeDays === opt.days ? 'btn btn-fill btn-sm' : 'btn btn-ghost btn-sm'}
              onClick={() => setRangeDays(opt.days)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton" style={{ height: 60 }} />
          <div className="skeleton" style={{ height: 60 }} />
        </div>
      ) : error ? (
        <p className="empty-state">Não foi possível carregar o histórico: {error.message}</p>
      ) : grouped.length === 0 ? (
        <p className="empty-state">Nenhum registro no período selecionado.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(([day, items]) => (
            <section className="surface surface-pad" key={day}>
              <div className="eyebrow" style={{ marginBottom: 'var(--space-3)', textTransform: 'capitalize' }}>{day}</div>
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <div className="dose-name">{item.suplemento?.nome || 'Suplemento'}</div>
                      <div className="dose-meta">
                        Previsto {new Date(item.dataHoraPrescrita).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {item.dataHoraRealizada && ` · Realizado ${new Date(item.dataHoraRealizada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    </div>
                    <span className={`chip ${STATUS_TONE[item.status] || ''}`}>{STATUS_LABEL[item.status] || item.status}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
