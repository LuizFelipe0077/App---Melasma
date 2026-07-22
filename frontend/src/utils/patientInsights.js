import { buildWeeklyEvolution } from './buildDayRecords.js';

function stdDev(values) {
  if (values.length < 2) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function daysSinceLastActivity(days) {
  const lastCheckin = days
    .flatMap((d) => d.checkins)
    .filter((c) => c.status !== 'PENDENTE' && c.dataHoraRealizada)
    .sort((a, b) => new Date(b.dataHoraRealizada) - new Date(a.dataHoraRealizada))[0];
  if (!lastCheckin) return null;
  return Math.floor((new Date() - new Date(lastCheckin.dataHoraRealizada)) / 86400000);
}

/**
 * Índice de Adesão (0-100): adesão×0.6 + consistência×0.25 + sequência×0.15.
 * Consistência penaliza variação entre os % semanais (desvio-padrão);
 * sequência recompensa estar perto da melhor marca já alcançada. Ver
 * PATIENT_HISTORY_REPORT.md para a metodologia completa.
 */
export function computeAdherenceIndex(taxaAdesaoGeral, days, gamificacao) {
  const adesaoScore = taxaAdesaoGeral;

  const weeklyRates = buildWeeklyEvolution(days).map((w) => w.rate);
  const consistenciaScore = weeklyRates.length < 2 ? 100 : Math.max(0, 100 - Math.min(100, stdDev(weeklyRates) * 2));

  const streakAtual = gamificacao?.streakAtual ?? 0;
  const maiorStreak = gamificacao?.maiorStreak ?? 0;
  const sequenciaScore = maiorStreak > 0 ? Math.min(100, (streakAtual / maiorStreak) * 100) : (streakAtual > 0 ? 100 : 0);

  const value = Math.round(adesaoScore * 0.6 + consistenciaScore * 0.25 + sequenciaScore * 0.15);

  let classification;
  if (value >= 90) classification = 'Excelente';
  else if (value >= 75) classification = 'Boa';
  else if (value >= 60) classification = 'Moderada';
  else if (value >= 40) classification = 'Baixa';
  else classification = 'Crítica';

  return {
    value,
    classification,
    breakdown: [
      { label: 'Adesão geral', value: Math.round(adesaoScore), weight: 60 },
      { label: 'Consistência semanal', value: Math.round(consistenciaScore), weight: 25 },
      { label: 'Sequência', value: Math.round(sequenciaScore), weight: 15 }
    ]
  };
}

/**
 * Risco de Baixa Adesão (0-100, maior = mais risco). Ver
 * PATIENT_HISTORY_REPORT.md para a metodologia completa. "Frequência de
 * acesso" usa o mesmo proxy dos alertas (check-in mais recente), já que o
 * sistema não rastreia login/acesso ao app.
 */
export function computeRiskLevel(days, gamificacao) {
  const past = days.filter((d) => d.status !== 'future');
  const diasPerdidos = past.filter((d) => d.status === 'missed').length;
  const diasPerdidosRatio = past.length > 0 ? diasPerdidos / past.length : 0;

  const streakAtual = gamificacao?.streakAtual ?? 0;
  const diasSemAtividade = daysSinceLastActivity(days);

  const last7 = past.slice(-7);
  const prescribed7 = last7.reduce((s, d) => s + d.checkins.length, 0);
  const done7 = last7.reduce((s, d) => s + d.checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length, 0);

  const score = Math.round(
    diasPerdidosRatio * 40 +
    (streakAtual === 0 ? 20 : 0) +
    Math.min(30, (diasSemAtividade ?? 0) * 5) +
    (prescribed7 > 0 && done7 < prescribed7 * 0.5 ? 10 : 0)
  );
  const value = Math.max(0, Math.min(100, score));

  let classification;
  if (value < 20) classification = 'Muito Baixo';
  else if (value < 40) classification = 'Baixo';
  else if (value < 60) classification = 'Moderado';
  else if (value < 80) classification = 'Alto';
  else classification = 'Crítico';

  return {
    value,
    classification,
    factors: [
      { label: 'Dias perdidos no período', detail: `${diasPerdidos} de ${past.length} dias` },
      { label: 'Sequência atual', detail: streakAtual === 0 ? 'Sem sequência ativa' : `${streakAtual} dias seguidos` },
      { label: 'Última atividade', detail: diasSemAtividade === null ? 'Sem registros' : `há ${diasSemAtividade} dia(s)` },
      { label: 'Check-ins últimos 7 dias', detail: prescribed7 > 0 ? `${done7}/${prescribed7}` : 'Sem doses no período' }
    ]
  };
}

const PERIOD_LABELS = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite' };

function periodOf(hour) {
  if (hour >= 5 && hour < 12) return 'manha';
  if (hour >= 12 && hour < 18) return 'tarde';
  return 'noite';
}

/** Agrupa check-ins por período do dia (Manhã 05-12h, Tarde 12-18h, Noite 18-05h). */
export function computeConsistencyMap(days) {
  const buckets = { manha: { prescribed: 0, done: 0 }, tarde: { prescribed: 0, done: 0 }, noite: { prescribed: 0, done: 0 } };

  for (const day of days) {
    if (day.status === 'future') continue;
    for (const c of day.checkins) {
      const period = periodOf(new Date(c.dataHoraPrescrita).getHours());
      buckets[period].prescribed++;
      if (c.status === 'CONCLUIDO' || c.status === 'ATRASADO') buckets[period].done++;
    }
  }

  const periods = Object.entries(buckets).map(([key, b]) => ({
    key,
    label: PERIOD_LABELS[key],
    prescribed: b.prescribed,
    rate: b.prescribed > 0 ? Math.round((b.done / b.prescribed) * 100) : null
  }));

  const withData = periods.filter((p) => p.rate !== null);
  const best = withData.length ? withData.reduce((a, b) => (b.rate > a.rate ? b : a)) : null;
  const worst = withData.length ? withData.reduce((a, b) => (b.rate < a.rate ? b : a)) : null;

  return { periods, best, worst };
}

function bestAndWorstWeek(days) {
  const past = days.filter((d) => d.status !== 'future');
  if (past.length < 7) return { best: null, worst: null };

  let best = null;
  let worst = null;
  for (let i = 0; i <= past.length - 7; i++) {
    const chunk = past.slice(i, i + 7);
    const prescribed = chunk.reduce((s, d) => s + d.checkins.length, 0);
    if (prescribed === 0) continue;
    const done = chunk.reduce((s, d) => s + d.checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length, 0);
    const rate = Math.round((done / prescribed) * 100);
    const window = { rate, start: chunk[0].date, end: chunk[6].date };
    if (!best || rate > best.rate) best = window;
    if (!worst || rate < worst.rate) worst = window;
  }
  return { best, worst };
}

/** Resumo Clínico: estatísticas derivadas para leitura rápida pelo admin. */
export function computeClinicalSummary(days, historicoAgrupadoPorSuplemento, gamificacao, consistencyMap) {
  const diasPerfeitos = days.filter((d) => d.status === 'completed').length;
  const maiorSequencia = gamificacao?.maiorStreak ?? 0;

  const comPrescricao = (historicoAgrupadoPorSuplemento || []).filter((s) => s.prescrito > 0);
  const suplementoNegligenciado = comPrescricao.length
    ? comPrescricao.reduce((a, b) => (b.taxaAdesao < a.taxaAdesao ? b : a))
    : null;

  const { best, worst } = bestAndWorstWeek(days);

  return {
    diasPerfeitos,
    maiorSequencia,
    suplementoNegligenciado,
    melhorHorario: consistencyMap.best,
    periodoMaiorConsistencia: best,
    periodoMaiorDificuldade: worst
  };
}

/**
 * Mescla, por dia, check-ins + observações clínicas + liberações
 * retroativas concedidas + marcação de quebra de sequência, para o
 * prontuário cronológico (aba Histórico Clínico).
 */
export function mergeChronologicalEvents(days, notes, permissoes) {
  const notesByDay = new Map();
  for (const n of notes || []) {
    const key = new Date(n.createdAt).toDateString();
    if (!notesByDay.has(key)) notesByDay.set(key, []);
    notesByDay.get(key).push({ kind: 'nota', ...n });
  }

  const permissoesByDay = new Map();
  for (const p of permissoes || []) {
    const key = new Date(p.createdAt).toDateString();
    if (!permissoesByDay.has(key)) permissoesByDay.set(key, []);
    permissoesByDay.get(key).push({ kind: 'permissao', ...p });
  }

  return days.map((day, idx) => {
    const key = day.date.toDateString();
    const events = [...(notesByDay.get(key) || []), ...(permissoesByDay.get(key) || [])];

    const prevDay = days[idx - 1];
    if (prevDay && day.status === 'missed' && (prevDay.status === 'completed' || prevDay.status === 'partial')) {
      events.push({ kind: 'quebra', texto: 'Quebra de sequência — nenhum check-in registrado após um período de adesão.' });
    }

    return { ...day, events };
  });
}
