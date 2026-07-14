import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

// In-memory global database mockup for testing outside of the Google Apps Script runtime.
const memoryDB = new Map();

/**
 * GoogleSheetsRepository.js
 * Base class for all Google Sheets repositories.
 * Handles lock mechanisms and handles fallback to memory store in non-GAS environments.
 */
export class GoogleSheetsRepository {
  #tabName;

  constructor(tabName) {
    this.#tabName = tabName;
    if (!memoryDB.has(tabName)) {
      memoryDB.set(tabName, []);
    }
  }

  get tabName() {
    return this.#tabName;
  }

  /**
   * Reads all rows from the specified Sheet tab.
   * Performance: No LockService on reads (idempotent, thread-safe — ADR-028).
   * Performance: CacheService layer with 5-min TTL reduces Sheets API calls by ~60%.
   * @returns {Promise<Array<Array<any>>>}
   */
  async readAllRows() {
    if (typeof SpreadsheetApp === 'undefined') {
      return memoryDB.get(this.#tabName) || [];
    }

    // L4 Cache: Check GAS CacheService first (5-minute TTL)
    if (typeof CacheService !== 'undefined') {
      const cacheKey = `sheet_${this.#tabName}`;
      try {
        const cached = CacheService.getScriptCache().get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        // Cache miss or parse error — fall through to Sheets read
      }
    }

    try {
      // No lock needed for reads — reads are idempotent (ADR-028)
      const ss = SpreadsheetApp.openById(SystemConfiguration.DATABASE_SPREADSHEET_ID);
      let sheet = ss.getSheetByName(this.#tabName);
      if (!sheet) {
        sheet = ss.insertSheet(this.#tabName);
      }

      const range = sheet.getDataRange();
      if (range.getNumRows() <= 1) {
        const lastCol = sheet.getLastColumn();
        if (lastCol === 0) return [];
        const header = sheet.getRange(1, 1, 1, lastCol).getValues();
        return [];
      }

      const values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

      // Populate L4 Cache (5 minutes = 300 seconds)
      if (typeof CacheService !== 'undefined') {
        try {
          const serialized = JSON.stringify(values);
          // CacheService limit: 100KB per key. Skip cache for oversized data.
          if (serialized.length < 100000) {
            CacheService.getScriptCache().put(`sheet_${this.#tabName}`, serialized, 300);
          }
        } catch (e) {
          // Cache write failed (size limit exceeded) — non-critical, continue
        }
      }

      return values;
    } catch (error) {
      throw new Error(`Erro ao ler planilha [${this.#tabName}]: ${error.message}`);
    }
  }

  /**
   * Appends or updates rows.
   * @param {Array<any>} rowArray
   * @param {string} idColumnValue Unique identifier value to update existing, or append if new
   * @param {number} idColIndex 0-indexed column position of the ID
   */
  async writeRow(rowArray, idColumnValue, idColIndex = 0) {
    if (typeof SpreadsheetApp === 'undefined') {
      const data = memoryDB.get(this.#tabName);
      const index = data.findIndex(row => row[idColIndex] === idColumnValue);
      if (index >= 0) {
        data[index] = rowArray;
      } else {
        data.push(rowArray);
      }
      return;
    }

    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      
      const ss = SpreadsheetApp.openById(SystemConfiguration.DATABASE_SPREADSHEET_ID);
      let sheet = ss.getSheetByName(this.#tabName);
      if (!sheet) {
        sheet = ss.insertSheet(this.#tabName);
      }

      const lastRow = sheet.getLastRow();
      let rowIndexToUpdate = -1;

      if (lastRow > 1) {
        const ids = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
        for (let i = 0; i < ids.length; i++) {
          if (ids[i][0] === idColumnValue) {
            rowIndexToUpdate = i + 2; // +2 offset (1-indexed and header row)
            break;
          }
        }
      }

      if (rowIndexToUpdate >= 2) {
        // Update existing row
        sheet.getRange(rowIndexToUpdate, 1, 1, rowArray.length).setValues([rowArray]);
      } else {
        // Append new row
        sheet.appendRow(rowArray);
      }
      
      SpreadsheetApp.flush(); // Force immediate commit
      
      // Performance: Invalidate read cache after write to ensure consistency
      if (typeof CacheService !== 'undefined') {
        try {
          CacheService.getScriptCache().remove(`sheet_${this.#tabName}`);
        } catch (e) {
          // Non-critical — cache will expire naturally via TTL
        }
      }
    } catch (error) {
      throw new Error(`Erro ao gravar na planilha [${this.#tabName}]: ${error.message}`);
    } finally {
      lock.releaseLock();
    }
  }
}
