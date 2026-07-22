import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';

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
        createdAt: r[5]
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
      observacao.createdAt
    ];
    this.writeRow(row, observacao.id, 0);
  }
}
