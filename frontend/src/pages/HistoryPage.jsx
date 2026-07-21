import { useMemo, useState } from 'react';
import Badge from '../components/Badge.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';

const RANGE_OPTIONS = [
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' } // backend hard-caps the window at 90 days (GerarDashboardUseCase)
];

const STATUS_TONE = { CONCLUIDO: 'success', ATRASADO: 'warning', PENDENTE: 'neutral' };
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
      <header className="header mb-6">
        <div>
          <h1 className="text-h1 text-2xl">Histórico</h1>
          <p className="text-p">Consulte suas doses registradas ao longo do tempo.</p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              className={rangeDays === opt.days ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
              onClick={() => setRangeDays(opt.days)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col gap-3">
          <div className="skeleton w-full" style={{ height: 60 }} />
          <div className="skeleton w-full" style={{ height: 60 }} />
          <div className="skeleton w-full" style={{ height: 60 }} />
        </div>
      ) : error ? (
        <p className="error-text">Falha ao carregar histórico: {error.message}</p>
      ) : grouped.length === 0 ? (
        <p className="text-xs text-tertiary text-center" style={{ padding: '24px 0' }}>Nenhum registro no período selecionado.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map(([day, items]) => (
            <section className="card" key={day}>
              <h3 className="text-sm font-semibold text-secondary mb-3" style={{ textTransform: 'capitalize' }}>{day}</h3>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <div key={item.id} className="wizard-item-row">
                    <div>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{item.suplemento?.nome || 'Suplemento'}</strong>
                      <div className="text-tertiary" style={{ fontSize: 'var(--text-xs)' }}>
                        Previsto: {new Date(item.dataHoraPrescrita).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {item.dataHoraRealizada && ` · Realizado: ${new Date(item.dataHoraRealizada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    </div>
                    <Badge tone={STATUS_TONE[item.status] || 'neutral'}>{STATUS_LABEL[item.status] || item.status}</Badge>
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
