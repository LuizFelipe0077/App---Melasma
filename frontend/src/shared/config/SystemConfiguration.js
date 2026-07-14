/**
 * SystemConfiguration.js
 * Centralized configuration settings for the Frontend client.
 */
export const SystemConfiguration = {
  // Production Apps Script URL (API Endpoint)
  // In production, this points to the deployed GAS web app URL.
  // In development, it falls back to local storage or development stub.
  API_BASE_URL: localStorage.getItem('API_BASE_URL') || 'https://script.google.com/macros/s/DEVELOPMENT_STUB/exec',

  // Session Management
  SESSION_TIMEOUT_MINUTES: 120, // 2 hours

  // UI Theme / Design Tokens (Apple Premium inspired Slate & Emerald Green)
  THEME: {
    PRIMARY_COLOR: '#0F172A',      // Slate 900
    SECONDARY_COLOR: '#10B981',    // Emerald 500
    ACCENT_COLOR: '#6366F1',       // Indigo 500
    BACKGROUND_LIGHT: '#F8FAFC',   // Slate 50
    BACKGROUND_DARK: '#020617',    // Slate 950
    CARD_BG_LIGHT: '#FFFFFF',
    CARD_BG_DARK: '#0F172A',       // Slate 900
    TEXT_MAIN_LIGHT: '#0F172A',
    TEXT_MAIN_DARK: '#F1F5F9',     // Slate 100
    TEXT_MUTED_LIGHT: '#64748B',   // Slate 500
    TEXT_MUTED_DARK: '#94A3B8',    // Slate 400
    BORDER_RADIUS: '16px',
    FONT_FAMILY: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },

  // Gamification display metadata
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
