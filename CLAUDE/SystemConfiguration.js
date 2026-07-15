/**
 * SystemConfiguration.js
 * Centralized configuration settings for the Frontend client.
 */
export const SystemConfiguration = {
  // Production Apps Script URL (API Endpoint)
  // In production, this points to the deployed GAS web app URL.
  // In development, it falls back to local storage or development stub.
  API_BASE_URL: localStorage.getItem('API_BASE_URL') || 'https://script.google.com/macros/s/AKfycby_E0a6SOkGz3zOScWyTVNVsH3SicSt6OEZMWISRk2wJLYlCYg2ugu1W3SkvNGlX1hG/exec',

  // Session Management
  SESSION_TIMEOUT_MINUTES: 120, // 2 hours

  // UI Theme / Design Tokens
  // ---------------------------------------------------------------------------
  // ESPELHO, NAO FONTE. A fonte de verdade e src/presentation/tokens.css.
  // As chaves e o formato deste objeto sao identicos aos anteriores (contrato
  // publico preservado); apenas os VALORES foram alinhados a paleta real, que
  // antes divergia por completo do que a interface renderizava.
  //
  // Ao alterar uma cor: edite tokens.css primeiro, espelhe aqui depois.
  // Em CSS, prefira sempre var(--color-*) a ler este objeto.
  THEME: {
    PRIMARY_COLOR: '#7A3A10',      // Melasma - primaria (briefing)
    SECONDARY_COLOR: '#5D7A58',    // Desinflamacao - primaria (briefing)
    ACCENT_COLOR: '#A35C2E',       // Melasma - secundaria (briefing)
    BACKGROUND_LIGHT: '#F8F2EE',   // Melasma - fundo (briefing)
    BACKGROUND_DARK: '#F4F8F3',    // Desinflamacao - fundo (briefing)
    CARD_BG_LIGHT: '#FFFDFB',      // Melasma - card (briefing)
    CARD_BG_DARK: '#FFFFFF',       // Desinflamacao - card (briefing)
    TEXT_MAIN_LIGHT: '#3D2415',    // Melasma - texto (briefing)
    TEXT_MAIN_DARK: '#2F4730',     // Desinflamacao - texto (briefing)
    TEXT_MUTED_LIGHT: '#6B4E3D',
    TEXT_MUTED_DARK: '#4A634B',
    BORDER_RADIUS: '16px',         // --radius-md (faixa 12-20 do briefing)
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
