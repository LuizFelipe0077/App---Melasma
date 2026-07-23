import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { fromSheetDateTime, toSheetDateTime } from '../../shared/utils/DateTimeFormatter.js';

// The sheet cell is stored PT-BR (DD/MM/AAAA HH:mm:ss) for a human opening
// the spreadsheet directly — but the use case/frontend contract expects ISO,
// same boundary-only translation used in CheckinMapper. toISO tolerates a
// blank/unparseable cell by falling back to the raw value untouched.
function toISO(sheetValue) {
  const parsed = fromSheetDateTime(sheetValue);
  return parsed ? parsed.toISOString() : sheetValue;
}

export class GoogleSheetsPermissaoRepository extends GoogleSheetsRepository {
  constructor() {
    super('PermissoesRetroativas');
  }

  findActiveByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    const now = new Date().getTime();

    // Find a permission for the patient that has status ACTIVE and has not expired
    const activePerm = rows.find(r => {
      if (r[1] !== pacienteId) return false;
      if (r[6] !== 'ATIVA') return false;
      const expTime = fromSheetDateTime(r[5])?.getTime();
      return expTime > now;
    });

    if (!activePerm) return null;

    return {
      id: activePerm[0],
      pacienteId: activePerm[1],
      horasLiberadas: Number(activePerm[2]),
      motivo: activePerm[3],
      operadorId: activePerm[4],
      expiraEm: toISO(activePerm[5]),
      status: activePerm[6],
      createdAt: toISO(activePerm[7])
    };
  }

  findAllByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    return rows
      .filter((r) => r[1] === pacienteId)
      .map((r) => ({
        id: r[0],
        pacienteId: r[1],
        horasLiberadas: Number(r[2]),
        motivo: r[3],
        operadorId: r[4],
        expiraEm: toISO(r[5]),
        status: r[6],
        createdAt: toISO(r[7])
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  save(permissao) {
    const row = [
      permissao.id,
      permissao.pacienteId,
      permissao.horasLiberadas,
      permissao.motivo,
      permissao.operadorId,
      toSheetDateTime(permissao.expiraEm),
      permissao.status,
      toSheetDateTime(permissao.createdAt)
    ];
    this.writeRow(row, permissao.id, 0);
  }
}
