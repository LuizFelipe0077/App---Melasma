import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';

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
      const expTime = new Date(r[5]).getTime();
      return expTime > now;
    });

    if (!activePerm) return null;

    return {
      id: activePerm[0],
      pacienteId: activePerm[1],
      horasLiberadas: Number(activePerm[2]),
      motivo: activePerm[3],
      operadorId: activePerm[4],
      expiraEm: activePerm[5],
      status: activePerm[6],
      createdAt: activePerm[7]
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
        expiraEm: r[5],
        status: r[6],
        createdAt: r[7]
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
      permissao.expiraEm,
      permissao.status,
      permissao.createdAt
    ];
    this.writeRow(row, permissao.id, 0);
  }
}
