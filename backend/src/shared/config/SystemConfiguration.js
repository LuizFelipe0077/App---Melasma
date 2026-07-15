/**
 * SystemConfiguration.js
 * Centralized configuration settings for the Clinical Integrative Treatment Tracking Backend.
 * Strictly avoids hardcoding sensitive strings across the codebase.
 */
export const SystemConfiguration = {
  // Database / Sheets Config
  // Read dynamically from PropertiesService to allow self-healing on the fly.
  get DATABASE_SPREADSHEET_ID() {
    return typeof PropertiesService !== 'undefined' 
      ? PropertiesService.getScriptProperties().getProperty('DATABASE_SPREADSHEET_ID') 
      : 'SANDBOX_SPREADSHEET_ID_DEFAULT';
  },

  // Clinical Rules & Window Tolerances
  CHECKIN_WINDOW_TOLERANCE_MINUTES: 60, // Window of ±60 minutes around prescribed time
  MAX_DAYS_TREATMENT: 365,              // Maximum allowed protocol duration
  ALERT_TOLERANCE_MINUTES: 15,          // Dispatch pre-alerts 15 minutes before dosage

  // Security Rules
  MAX_LOGIN_ATTEMPTS: 5,                // Max password failures before locking account
  LOGIN_LOCKOUT_MINUTES: 15,            // Lockout period on brute-force detection
  SESSION_TIMEOUT_MINUTES: 120,         // Session inactivity timeout (2 hours)

  // Gamification Mechanics (Refined)
  XP_PER_ON_TIME_CHECKIN: 10,           // On time check-in reward
  XP_PER_LATE_CHECKIN: 5,               // Late check-in reward
  XP_STREAK_BONUS_MULTIPLIER: 1.5,      // Multiplier bonus for 7-day streak consistency
  XP_LEVEL_BASE: 100,                   // Leveling base divider formula: XP_Needed = level * base

  // Environment and Meta
  get ENV() {
    return typeof PropertiesService !== 'undefined'
      ? PropertiesService.getScriptProperties().getProperty('ENV') || 'production'
      : 'development';
  }
};
