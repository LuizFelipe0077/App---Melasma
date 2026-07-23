import { CheckIn } from '../../domain/entities/CheckIn.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { SheetColumns } from './GoogleSheetsColumns.js';
import { fromSheetDateTime, toSheetDateTime } from '../../shared/utils/DateTimeFormatter.js';

/**
 * CheckinMapper.js
 * Translates Google Sheets rows to CheckIn entity instances and vice versa.
 */
export class CheckinMapper {
  /**
   * Converts CheckIn domain entity to array row.
   * @param {CheckIn} checkin 
   */
  static toRow(checkin) {
    const row = [];
    row[SheetColumns.CHECKIN.ID] = checkin.id.value;
    row[SheetColumns.CHECKIN.PACIENTE_ID] = checkin.pacienteId.value;
    row[SheetColumns.CHECKIN.SUPLEMENTO_ID] = checkin.suplementoId.value;
    row[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA] = toSheetDateTime(checkin.dataHoraPrescrita);
    row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA] = checkin.dataHoraRealizada ? toSheetDateTime(checkin.dataHoraRealizada) : '';
    row[SheetColumns.CHECKIN.STATUS] = checkin.status;
    row[SheetColumns.CHECKIN.RETROATIVO] = checkin.retroativo ? 'SIM' : 'NAO';
    return row;
  }

  /**
   * Converts array row to CheckIn domain entity.
   * A single malformed row (e.g. legacy/manually-edited data with a status
   * outside the CheckIn enum) must not take down every other valid check-in
   * for the same patient — so a construction failure here is logged (visible
   * in Stackdriver) and treated as "skip this row", the same convention
   * PacienteMapper/ListarPacientesUseCase already use for bad rows.
   * @param {Array<any>} row
   */
  static toDomain(row) {
    if (!row || row.length === 0) return null;
    try {
      return new CheckIn({
        id: new UUID(row[SheetColumns.CHECKIN.ID]),
        pacienteId: new UUID(row[SheetColumns.CHECKIN.PACIENTE_ID]),
        suplementoId: new UUID(row[SheetColumns.CHECKIN.SUPLEMENTO_ID]),
        dataHoraPrescrita: fromSheetDateTime(row[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA]),
        dataHoraRealizada: row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA] ? fromSheetDateTime(row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA]) : null,
        status: row[SheetColumns.CHECKIN.STATUS],
        retroativo: ['SIM', 'TRUE', true].includes(row[SheetColumns.CHECKIN.RETROATIVO])
      });
    } catch (error) {
      if (typeof console !== 'undefined') {
        console.error(`[CheckinMapper] Linha de Check_Ins ignorada (dado inválido): id=${row[SheetColumns.CHECKIN.ID]} status=${row[SheetColumns.CHECKIN.STATUS]} — ${error.message}`);
      }
      return null;
    }
  }
}
