/**
 * AuditLogger.js
 * Centralized audit trail service that records all security-relevant events
 * and data mutations for LGPD compliance and forensic analysis.
 * 
 * Security Layer: Infrastructure / Observability
 * Compliance: LGPD Art. 37 (Registro de Tratamento), OWASP A09:2021 – Logging & Monitoring Failures
 * 
 * Architecture Note: Writes to the 'Auditoria' sheet tab. When migrating to
 * PostgreSQL, replace GoogleSheetsAuditWriter with PostgresAuditWriter
 * while keeping this service's interface intact.
 */
import { UUID } from '../../domain/valueObjects/UUID.js';

export class AuditLogger {

  /**
   * Records an audit event in the persistent audit trail.
   * @param {object} params
   * @param {string} params.operadorId - UUID of the user performing the action
   * @param {string} params.tabela - Target entity/table name
   * @param {string} params.registroId - UUID of the affected record
   * @param {string} params.tipoAcao - Action type: CREATE, UPDATE, DELETE, READ, LOGIN, LOGOUT, EXPORT
   * @param {object} [params.dadosAntigos] - Previous values (for UPDATE/DELETE)
   * @param {object} [params.dadosNovos] - New values (for CREATE/UPDATE)
   * @param {string} [params.ip] - Client IP address (when available)
   * @param {string} [params.dispositivo] - User-Agent string
   * @param {string} [params.motivo] - Human-readable justification
   */
  static log({ operadorId, tabela, registroId, tipoAcao, dadosAntigos = null, dadosNovos = null, ip = 'N/A', dispositivo = 'N/A', motivo = '' }) {
    const dataHoraBrasil = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const entry = {
      id: UUID.generate().value,
      timestamp: dataHoraBrasil,
      operadorId: operadorId || 'SYSTEM',
      tabela,
      registroId: registroId || 'N/A',
      tipoAcao,
      dadosAntigos: dadosAntigos ? JSON.stringify(dadosAntigos) : '',
      dadosNovos: dadosNovos ? JSON.stringify(dadosNovos) : '',
      ip,
      dispositivo,
      motivo
    };

    // Persist to Google Sheets 'Auditoria' tab
    if (typeof SpreadsheetApp !== 'undefined') {
      try {
        const ssId = typeof PropertiesService !== 'undefined'
          ? PropertiesService.getScriptProperties().getProperty('DATABASE_SPREADSHEET_ID')
          : null;
        
        if (ssId) {
          const ss = SpreadsheetApp.openById(ssId);
          let sheet = ss.getSheetByName('Auditoria');
          if (!sheet) {
            sheet = ss.insertSheet('Auditoria');
            sheet.getRange(1, 1, 1, 11).setValues([[
              'id', 'timestamp', 'operadorId', 'tabela', 'registroId',
              'tipoAcao', 'dadosAntigos', 'dadosNovos', 'ip', 'dispositivo', 'motivo'
            ]]);
          }
          sheet.appendRow([
            entry.id, entry.timestamp, entry.operadorId, entry.tabela,
            entry.registroId, entry.tipoAcao, entry.dadosAntigos,
            entry.dadosNovos, entry.ip, entry.dispositivo, entry.motivo
          ]);
        }
      } catch (auditError) {
        // Audit logging must never crash the main operation (fail-open for logging)
        if (typeof console !== 'undefined') {
          console.error('AuditLogger: Falha ao registrar auditoria:', auditError.message);
        }
      }
    }

    // In-memory fallback for tests and local development
    if (!AuditLogger.#memoryLog) {
      AuditLogger.#memoryLog = [];
    }
    AuditLogger.#memoryLog.push(entry);

    return entry;
  }

  /** @type {Array} */
  static #memoryLog = [];

  /**
   * Returns the in-memory log entries (for testing and local dev only).
   * @returns {Array}
   */
  static getMemoryLog() {
    return [...(AuditLogger.#memoryLog || [])];
  }

  /**
   * Clears in-memory log (for test suite resets).
   */
  static clearMemoryLog() {
    AuditLogger.#memoryLog = [];
  }

  /**
   * Logs a security-specific event (login attempts, failures, anomalies).
   * @param {string} eventType - SECURITY_LOGIN_SUCCESS, SECURITY_LOGIN_FAILURE, SECURITY_LOCKOUT, SECURITY_TOKEN_EXPIRED
   * @param {string} userId
   * @param {object} [metadata]
   */
  static logSecurityEvent(eventType, userId, metadata = {}) {
    return AuditLogger.log({
      operadorId: userId || 'ANONYMOUS',
      tabela: 'Sessoes',
      registroId: metadata.sessionId || 'N/A',
      tipoAcao: eventType,
      dadosNovos: metadata,
      ip: metadata.ip || 'N/A',
      dispositivo: metadata.userAgent || 'N/A',
      motivo: metadata.motivo || eventType
    });
  }
}
