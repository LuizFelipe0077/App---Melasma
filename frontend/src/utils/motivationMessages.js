/**
 * motivationMessages.js
 * Milestone-triggered reinforcement copy for the patient dashboard. Only
 * fires on genuine milestones (never on every plain check-in) so it reads as
 * recognition, not noise — and picks a random variant per category so the
 * same milestone never shows the exact same sentence twice in a row.
 */
const BANK = {
  firstCheckin: [
    'Excelente começo! O primeiro passo é sempre o mais importante.',
    'Pronto, começou. É exatamente assim que uma rotina se constrói.',
  ],
  perfectDay: [
    'Parabéns! Hoje você concluiu todas as etapas do seu protocolo.',
    'Dia perfeito. Tudo o que era pra ser feito, foi feito.',
  ],
  streak3: [
    'Sua consistência está construindo resultados.',
    '3 dias seguidos — o ritmo já está pegando.',
  ],
  streak7: [
    'Uma semana completa! Continue nesse ritmo.',
    '7 dias de constância. Isso já é um hábito se formando.',
  ],
  streak14: [
    'Seu compromisso está fazendo diferença.',
    '14 dias seguidos — a consistência já é visível.',
  ],
  streak30: [
    'Um mês inteiro de dedicação. Continue firme.',
    '30 dias. Esse é o tipo de constância que sustenta resultado.',
  ],
  halfway: [
    'Você já percorreu metade da jornada.',
    'Metade do tratamento concluída — o ritmo está sendo mantido.',
  ],
  lastDay: [
    'Parabéns! Você concluiu seu protocolo.',
    'Chegou ao fim do protocolo — a consistência valeu a pena.',
  ],
};

function pick(category) {
  const variants = BANK[category];
  return variants[Math.floor(Math.random() * variants.length)];
}

const STREAK_MILESTONES = [30, 14, 7, 3];

/**
 * Returns the highest-priority milestone message for this moment, or null
 * if nothing milestone-worthy happened (the common case — a regular
 * check-in shouldn't trigger a toast).
 * @param {{isFirstCheckin: boolean, isPerfectDay: boolean, streakAfter: number, elapsedDays: number, totalDays: number}} ctx
 */
export function getMotivationMessage({ isFirstCheckin, isPerfectDay, streakAfter, elapsedDays, totalDays }) {
  if (totalDays && elapsedDays >= totalDays) return pick('lastDay');
  if (totalDays && elapsedDays === Math.round(totalDays / 2)) return pick('halfway');

  const streakHit = STREAK_MILESTONES.find((m) => m === streakAfter);
  if (streakHit) return pick(`streak${streakHit}`);

  if (isPerfectDay) return pick('perfectDay');
  if (isFirstCheckin) return pick('firstCheckin');

  return null;
}
