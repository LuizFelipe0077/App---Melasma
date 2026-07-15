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

  // UI Theme / Design Tokens (Premium Palette: Melasma Earth tones & Sage Greens)
  THEME: {
    PRIMARY_COLOR: '#2D3748',      // Charcoal (Text & Headers)
    SECONDARY_COLOR: '#8FA294',    // Sage Green (Desinflamação - Calm)
    ACCENT_COLOR: '#C4A484',       // Soft Earth/Camel (Melasma - Elegance)
    BACKGROUND_LIGHT: '#FAF9F6',   // Off-white/Alabaster
    BACKGROUND_DARK: '#1A202C',    // Deep Charcoal (Dark mode)
    CARD_BG_LIGHT: '#FFFFFF',
    CARD_BG_DARK: '#2D3748',       
    TEXT_MAIN_LIGHT: '#2D3748',
    TEXT_MAIN_DARK: '#F7FAFC',     
    TEXT_MUTED_LIGHT: '#718096',   
    TEXT_MUTED_DARK: '#A0AEC0',    
    BORDER_RADIUS: '12px',
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
