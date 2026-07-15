import { PacienteFactory } from '../../domain/entities/PacienteFactory.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

/**
 * PacienteMapper.js
 * Translates Google Sheets rows (Arrays) to Domain Entity instances and vice versa.
 */
export class PacienteMapper {
  /**
   * Converts a domain Paciente entity into an array row for Google Sheets.
   * @param {Paciente} paciente 
   * @returns {Array<any>}
   */
  static toRow(paciente) {
    const formatDatePtBr = (d) => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const row = [];
    row[SheetColumns.PACIENTE.ID] = paciente.id.value;
    row[SheetColumns.PACIENTE.NOME] = paciente.nome;
    row[SheetColumns.PACIENTE.EMAIL] = paciente.email.value;
    row[SheetColumns.PACIENTE.TELEFONE] = paciente.telefone.value;
    row[SheetColumns.PACIENTE.SENHA_HASH] = paciente.senhaHash.value;
    row[SheetColumns.PACIENTE.PROTOCOLO_ID] = paciente.protocoloId ? paciente.protocoloId.value : '';
    row[SheetColumns.PACIENTE.STATUS] = paciente.status;
    row[SheetColumns.PACIENTE.DATA_INICIO] = formatDatePtBr(paciente.dataInicio);
    row[SheetColumns.PACIENTE.DATA_FIM] = formatDatePtBr(paciente.dataFim);
    row[SheetColumns.PACIENTE.OBSERVACOES] = paciente.observacoes;
    row[SheetColumns.PACIENTE.PROTOCOLO_NOME] = paciente.protocoloNome;
    return row;
  }

  /**
   * Converts an array row from Google Sheets into a domain Paciente entity.
   * @param {Array<any>} row 
   * @returns {Paciente}
   */
  static toDomain(row) {
    if (!row || row.length === 0) return null;
    return PacienteFactory.reconstitute({
      id: row[SheetColumns.PACIENTE.ID],
      nome: row[SheetColumns.PACIENTE.NOME],
      email: row[SheetColumns.PACIENTE.EMAIL],
      telefone: row[SheetColumns.PACIENTE.TELEFONE],
      senhaHash: row[SheetColumns.PACIENTE.SENHA_HASH],
      protocoloId: row[SheetColumns.PACIENTE.PROTOCOLO_ID] || null,
      status: row[SheetColumns.PACIENTE.STATUS],
      dataInicio: row[SheetColumns.PACIENTE.DATA_INICIO],
      dataFim: row[SheetColumns.PACIENTE.DATA_FIM],
      observacoes: row[SheetColumns.PACIENTE.OBSERVACOES] || '',
      protocoloNome: row[SheetColumns.PACIENTE.PROTOCOLO_NOME] || 'Melasma'
    });
  }
}
