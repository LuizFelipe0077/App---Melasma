import { useMemo } from 'react';
import { ApiClient } from '../api/apiClient.js';
import { HeroStatCard } from '../components/StatCard.jsx';
import SupplementCard from '../components/SupplementCard.jsx';
import WeekStrip from '../components/WeekStrip.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useDashboardData } from '../hooks/useDashboardData.js';

function buildTodaySlots(dashboard) {
  const activeSuplementos = dashboard?.historicoAgrupadoPorSuplemento || [];
  const rawCheckins = dashboard?.rawCheckins || [];
  const todayStr = new Date().toDateString();
  const slots = [];

  for (const sup of activeSuplementos) {
    for (const horario of sup.horarios) {
      const prescribedTime = new Date();
      const [hours, minutes] = horario.split(':');
      prescribedTime.setHours(Number(hours), Number(minutes), 0, 0);

      const match = rawCheckins.find((c) => {
        if (c.suplementoId !== sup.suplementoId) return false;
        const cDate = new Date(c.dataHoraPrescrita);
        return cDate.toDateString() === todayStr && cDate.getHours() === Number(hours) && cDate.getMinutes() === Number(minutes);
      });

      const checkinInfo = match
        ? {
            id: match.id,
            status: match.status,
            dataHoraPrescrita: prescribedTime,
            dataHoraRealizada: match.dataHoraRealizada ? new Date(match.dataHoraRealizada) : null
          }
        : { id: null, status: 'PENDENTE', dataHoraPrescrita: prescribedTime, dataHoraRealizada: null };

      slots.push({
        suplemento: { id: sup.suplementoId, nome: sup.nome, dosagem: sup.dosagem, instrucoes: sup.instrucoes },
        checkin: checkinInfo
      });
    }
  }

  return slots.sort((a, b) => a.checkin.dataHoraPrescrita - b.checkin.dataHoraPrescrita);
}

export default function PatientDashboardPage() {
  const { session } = useAuth();
  const { showToast, showError } = useToast();

  const { dataInicio, dataFim } = useMemo(() => {
    const today = new Date();
    return {
      dataInicio: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
      dataFim: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString()
    };
  }, []);

  const { data: dashboard, loading, error, reload } = useDashboardData(dataInicio, dataFim);

  const slots = useMemo(() => buildTodaySlots(dashboard), [dashboard]);
  const streak = dashboard?.gamificacao?.streakAtual ?? 0;
  const rate = dashboard?.taxaAdesaoGeral ?? 0;

  const handleCheck = async (suplemento, checkin) => {
    try {
      const result = await ApiClient.call('registrarCheckin', {
        suplementoId: suplemento.id,
        dataHoraPrescrita: checkin.dataHoraPrescrita.toISOString()
      });

      showToast({
        message: `${suplemento.nome} registrado!`,
        actionLabel: 'Desfazer',
        duration: 4000,
        onAction: async () => {
          try {
            await ApiClient.call('cancelarCheckin', { checkinId: result.checkinId });
          } catch (err) {
            showError(err.message);
          } finally {
            reload();
          }
        }
      });

      reload();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleUndo = async (suplemento, checkin) => {
    try {
      await ApiClient.call('cancelarCheckin', { checkinId: checkin.id });
      showToast({ message: `Check-in de ${suplemento.nome} cancelado.` });
      reload();
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <>
      <header className="header mb-2">
        <div>
          <h1 className="text-h1 text-2xl">Olá, <span className="font-light">{session.nome}</span></h1>
          <p className="text-p">Aqui está o resumo da sua saúde hoje.</p>
        </div>
      </header>

      <div className="bento-grid mt-6">
        <HeroStatCard rate={rate} streak={streak} />

        <section className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 className="text-h1 text-lg mb-4">Doses Prescritas para Hoje</h3>
          {loading ? (
            <div className="flex flex-col gap-3">
              <div className="skeleton w-full" style={{ height: 80 }} />
              <div className="skeleton w-full" style={{ height: 80 }} />
            </div>
          ) : error ? (
            <p className="error-text">Falha ao carregar dashboard: {error.message}</p>
          ) : slots.length === 0 ? (
            <p className="text-xs text-tertiary text-center" style={{ padding: '24px 0' }}>
              Nenhum suplemento prescrito para o seu tratamento.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {slots.map((slot) => (
                <SupplementCard
                  key={`${slot.suplemento.id}-${slot.checkin.dataHoraPrescrita.getTime()}`}
                  suplemento={slot.suplemento}
                  checkin={slot.checkin}
                  onCheck={handleCheck}
                  onUndo={handleUndo}
                />
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h3 className="text-h1 text-lg mb-4">Evolução Semanal</h3>
          {loading ? <div className="skeleton w-full" style={{ height: 40 }} /> : <WeekStrip rate={rate} />}
        </section>
      </div>
    </>
  );
}
