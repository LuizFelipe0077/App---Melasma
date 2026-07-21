/**
 * systemConfiguration.js
 * Centralized configuration for the frontend client.
 */
export const SystemConfiguration = {
  API_BASE_URL:
    localStorage.getItem('API_BASE_URL') ||
    'https://script.google.com/macros/s/AKfycby_E0a6SOkGz3zOScWyTVNVsH3SicSt6OEZMWISRk2wJLYlCYg2ugu1W3SkvNGlX1hG/exec',

  SESSION_TIMEOUT_MINUTES: 120,

  ENV: import.meta.env.MODE,

  STREAK_EMOJI: '🔥',
  XP_EMOJI: '✨',
  LEVEL_TITLES: {
    1: 'Iniciante Consistente',
    2: 'Ritmo Consolidado',
    3: 'Foco Diário',
    4: 'Hábitos Saudáveis',
    5: 'Mestre da Rotina'
  }
};
