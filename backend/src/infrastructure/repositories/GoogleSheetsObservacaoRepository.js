import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { fromSheetDateTime, toSheetDateTime } from '../../shared/utils/DateTimeFormatter.js';

// Same boundary-only translation as CheckinMapper/GoogleSheetsPermissaoRepository:
// the sheet cell is PT-BR, the DTO returned to the use case/frontend stays ISO.
function toISO(sheetValue) {
  const parsed = fromSheetDateTime(sheetValue);
  return parsed ? parsed.toISOString() : sheetValue;
}

export class GoogleSheetsObservacaoRepository extends GoogleSheetsRepository {
  constructor() {
    super('Observacoes');
  }

  findByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    return rows
      .filter((r) => r[1] === pacienteId)
      .map((r) => ({
        id: r[0],
        pacienteId: r[1],
        operadorId: r[2],
        texto: r[3],
        tipo: r[4],
        createdAt: toISO(r[5])
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  save(observacao) {
    const row = [
      observacao.id,
      observacao.pacienteId,
      observacao.operadorId,
      observacao.texto,
      observacao.tipo,
      toSheetDateTime(observacao.createdAt)
    ];
    this.writeRow(row, observacao.id, 0);
  }
}
