import { CheckIn } from '../../domain/entities/CheckIn.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

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
    row[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA] = checkin.dataHoraPrescrita.toISOString();
    row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA] = checkin.dataHoraRealizada ? checkin.dataHoraRealizada.toISOString() : '';
    row[SheetColumns.CHECKIN.STATUS] = checkin.status;
    row[SheetColumns.CHECKIN.RETROATIVO] = checkin.retroativo ? 'TRUE' : 'FALSE';
    return row;
  }

  /**
   * Converts array row to CheckIn domain entity.
   * @param {Array<any>} row 
   */
  static toDomain(row) {
    if (!row || row.length === 0) return null;
    return new CheckIn({
      id: new UUID(row[SheetColumns.CHECKIN.ID]),
      pacienteId: new UUID(row[SheetColumns.CHECKIN.PACIENTE_ID]),
      suplementoId: new UUID(row[SheetColumns.CHECKIN.SUPLEMENTO_ID]),
      dataHoraPrescrita: new Date(row[SheetColumns.CHECKIN.DATA_HORA_PRESCRITA]),
      dataHoraRealizada: row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA] ? new Date(row[SheetColumns.CHECKIN.DATA_HORA_REALIZADA]) : null,
      status: row[SheetColumns.CHECKIN.STATUS],
      retroativo: row[SheetColumns.CHECKIN.RETROATIVO] === 'TRUE' || row[SheetColumns.CHECKIN.RETROATIVO] === true
    });
  }
}
