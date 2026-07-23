/**
 * Groups a gerarDashboard response's rawCheckins by calendar day, for the
 * Patient History timeline/heatmap/chart. Days are classified from the
 * check-in rows that actually exist in Check_Ins (pre-generated at patient
 * creation) — supplements added later via adicionarSuplemento won't have
 * pre-generated future rows, so they only appear on days they were actually
 * checked in on. This mirrors how the patient dashboard itself reconstructs
 * "today", just generalized across a date range.
 */
export function buildDayRecords(dashboard, dataInicioTratamento, startWindow, endWindow) {
  const suplementosById = new Map();
  (dashboard?.historicoAgrupadoPorSuplemento || []).forEach((s) => suplementosById.set(s.suplementoId, s));

  const byDay = new Map();
  for (const c of dashboard?.rawCheckins || []) {
    const date = new Date(c.dataHoraPrescrita);
    const key = date.toDateString();
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push({
      ...c,
      suplemento: suplementosById.get(c.suplementoId)
    });
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const treatmentStart = new Date(dataInicioTratamento);
  treatmentStart.setHours(0, 0, 0, 0);

  const days = [];
  const cursor = new Date(startWindow);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(endWindow);
  end.setHours(0, 0, 0, 0);

  let dayNumber = Math.round((cursor - treatmentStart) / 86400000) + 1;

  while (cursor <= end) {
    const key = cursor.toDateString();
    const checkins = (byDay.get(key) || []).sort((a, b) => new Date(a.dataHoraPrescrita) - new Date(b.dataHoraPrescrita));
    const isFuture = cursor > today;
    const isBeforeTreatment = cursor < treatmentStart;

    // A dose feita fora da janela de tolerância vira ATRASADO, não
    // CONCLUIDO — e ainda assim foi tomada, então conta como "feita" aqui
    // (mesmo critério já usado em buildWeeklyEvolution/computeAlerts/
    // buildDailyAdherence abaixo). Também não dá para usar
    // "checkins.length === 0" como sinônimo de "nada foi tomado": every
    // dose agendada já nasce com uma linha PENDENTE pré-gerada na criação
    // do paciente, então esse array quase nunca está vazio de fato.
    let status;
    if (isFuture || isBeforeTreatment) {
      status = 'future';
    } else {
      const doneCount = checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length;
      if (checkins.length === 0 || doneCount === 0) {
        status = 'missed';
      } else if (doneCount === checkins.length) {
        status = 'completed';
      } else {
        status = 'partial';
      }
    }

    days.push({
      date: new Date(cursor),
      dayNumber,
      checkins,
      status
    });

    cursor.setDate(cursor.getDate() + 1);
    dayNumber += 1;
  }

  return days;
}

export function buildWeeklyEvolution(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const chunk = days.slice(i, i + 7).filter((d) => d.status !== 'future');
    if (chunk.length === 0) continue;
    const totalPrescribed = chunk.reduce((sum, d) => sum + d.checkins.length, 0);
    const totalDone = chunk.reduce((sum, d) => sum + d.checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length, 0);
    const rate = totalPrescribed > 0 ? Math.round((totalDone / totalPrescribed) * 100) : 0;
    weeks.push({ weekNumber: Math.floor(i / 7) + 1, rate });
  }
  return weeks;
}

/**
 * Computes admin-facing alerts from the same day records + gamificacao
 * already loaded — no extra backend call. "Última atividade" is a proxy
 * (most recent check-in timestamp), since the system doesn't track app
 * access/login events anywhere today — labeled honestly as such.
 */
export function computeAlerts(days, gamificacao) {
  const alerts = [];
  const past = days.filter((d) => d.status !== 'future');

  let consecutiveMissed = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    if (past[i].status === 'missed') consecutiveMissed++;
    else break;
  }
  if (consecutiveMissed >= 2) {
    alerts.push({ severity: 'danger', icon: '⚠️', text: `Paciente ficou ${consecutiveMissed} dias sem nenhum check-in.` });
  }

  if (gamificacao && gamificacao.maiorStreak > 0 && gamificacao.streakAtual === 0) {
    alerts.push({ severity: 'warning', icon: '📉', text: `Perdeu a sequência (melhor marca: ${gamificacao.maiorStreak} dias).` });
  }

  const last7 = past.slice(-7);
  const prev7 = past.slice(-14, -7);
  const rateOf = (chunk) => {
    const prescribed = chunk.reduce((s, d) => s + d.checkins.length, 0);
    const done = chunk.reduce((s, d) => s + d.checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length, 0);
    return prescribed > 0 ? (done / prescribed) * 100 : null;
  };
  const rLast = rateOf(last7);
  const rPrev = rateOf(prev7);
  if (rLast !== null && rPrev !== null && rLast < rPrev - 15) {
    alerts.push({ severity: 'warning', icon: '📊', text: `Adesão caiu de ${Math.round(rPrev)}% para ${Math.round(rLast)}% na última semana.` });
  }

  const overdueCount = past.slice(-7).reduce((s, d) => s + d.checkins.filter((c) => c.status === 'ATRASADO').length, 0);
  if (overdueCount >= 3) {
    alerts.push({ severity: 'warning', icon: '⏰', text: `${overdueCount} suplementos atrasados nos últimos 7 dias.` });
  }

  const lastCheckin = days
    .flatMap((d) => d.checkins)
    .filter((c) => c.status !== 'PENDENTE' && c.dataHoraRealizada)
    .sort((a, b) => new Date(b.dataHoraRealizada) - new Date(a.dataHoraRealizada))[0];
  if (lastCheckin) {
    const daysSince = Math.floor((new Date() - new Date(lastCheckin.dataHoraRealizada)) / 86400000);
    if (daysSince >= 3) {
      alerts.push({ severity: 'danger', icon: '🕓', text: `Última atividade registrada há ${daysSince} dias (proxy: check-in mais recente — o sistema não rastreia acesso ao app).` });
    }
  }

  return alerts;
}

export function buildDailyAdherence(days, windowDays = 30) {
  // Only elapsed days carry a real rate — slice from the past-days subset so
  // a window that extends into the future (e.g. "todo o tratamento") doesn't
  // starve the chart of data points.
  const past = days.filter((d) => d.status !== 'future');
  return past.slice(-windowDays).map((d) => {
    if (d.checkins.length === 0) return { date: d.date, rate: 0 };
    const done = d.checkins.filter((c) => c.status === 'CONCLUIDO' || c.status === 'ATRASADO').length;
    return { date: d.date, rate: Math.round((done / d.checkins.length) * 100) };
  });
}
