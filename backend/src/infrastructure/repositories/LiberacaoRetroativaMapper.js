import { LiberacaoRetroativa, StatusLiberacao } from '../../domain/entities/LiberacaoRetroativa.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { SheetColumns } from './GoogleSheetsColumns.js';
import { fromSheetDateTime, toSheetDateTime } from '../../shared/utils/DateTimeFormatter.js';

/**
 * LiberacaoRetroativaMapper.js
 * Translates Google Sheets rows to LiberacaoRetroativa entity instances and vice versa.
 */
export class LiberacaoRetroativaMapper {
  static toRow(liberacao) {
    const row = [];
    row[SheetColumns.LIBERACAO.ID] = liberacao.id.value;
    row[SheetColumns.LIBERACAO.PACIENTE_ID] = liberacao.pacienteId.value;
    row[SheetColumns.LIBERACAO.DATA_LIBERADA] = toSheetDateTime(liberacao.dataLiberada);
    row[SheetColumns.LIBERACAO.CONCEDIDA_EM] = toSheetDateTime(liberacao.concedidaEm);
    row[SheetColumns.LIBERACAO.EXPIRA_EM] = toSheetDateTime(liberacao.expiraEm);
    row[SheetColumns.LIBERACAO.OPERADOR_ID] = liberacao.operadorId;
    row[SheetColumns.LIBERACAO.MOTIVO] = liberacao.motivo;
    row[SheetColumns.LIBERACAO.STATUS] = liberacao.status;
    row[SheetColumns.LIBERACAO.UTILIZADA_EM] = liberacao.usadaEm ? toSheetDateTime(liberacao.usadaEm) : '';
    return row;
  }

  /**
   * A single malformed row must not take down the whole listing — same
   * skip-and-log convention as CheckinMapper.
   * @param {Array<any>} row
   */
  static toDomain(row) {
    if (!row || row.length === 0) return null;
    try {
      return new LiberacaoRetroativa({
        id: new UUID(row[SheetColumns.LIBERACAO.ID]),
        pacienteId: new UUID(row[SheetColumns.LIBERACAO.PACIENTE_ID]),
        dataLiberada: fromSheetDateTime(row[SheetColumns.LIBERACAO.DATA_LIBERADA]),
        concedidaEm: fromSheetDateTime(row[SheetColumns.LIBERACAO.CONCEDIDA_EM]),
        expiraEm: fromSheetDateTime(row[SheetColumns.LIBERACAO.EXPIRA_EM]),
        operadorId: row[SheetColumns.LIBERACAO.OPERADOR_ID],
        motivo: row[SheetColumns.LIBERACAO.MOTIVO],
        status: row[SheetColumns.LIBERACAO.STATUS],
        usadaEm: row[SheetColumns.LIBERACAO.UTILIZADA_EM] ? fromSheetDateTime(row[SheetColumns.LIBERACAO.UTILIZADA_EM]) : null
      });
    } catch (error) {
      if (typeof console !== 'undefined') {
        console.error(`[LiberacaoRetroativaMapper] Linha de LiberacoesRetroativas ignorada (dado inválido): id=${row[SheetColumns.LIBERACAO.ID]} — ${error.message}`);
      }
      return null;
    }
  }
}

export { StatusLiberacao };
