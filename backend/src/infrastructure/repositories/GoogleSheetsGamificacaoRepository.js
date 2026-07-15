import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { GamificacaoRepositoryInterface } from '../../application/repositories/GamificacaoRepositoryInterface.js';
import { Gamificacao } from '../../domain/entities/Gamificacao.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsGamificacaoRepository extends GoogleSheetsRepository {
  constructor() {
    super('Gamificacao');
  }

  findByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    const row = rows.find(r => r[SheetColumns.GAMIFICACAO.PACIENTE_ID] === pacienteId);
    if (!row) return null;

    let achievements = [];
    try {
      achievements = typeof row[SheetColumns.GAMIFICACAO.CONQUISTAS] === 'string' ? JSON.parse(row[SheetColumns.GAMIFICACAO.CONQUISTAS]) : row[SheetColumns.GAMIFICACAO.CONQUISTAS];
    } catch (e) {
      achievements = [];
    }

    return new Gamificacao({
      id: new UUID(row[SheetColumns.GAMIFICACAO.ID]),
      pacienteId: new UUID(row[SheetColumns.GAMIFICACAO.PACIENTE_ID]),
      xpTotal: Number(row[SheetColumns.GAMIFICACAO.XP_TOTAL]),
      streakAtual: Number(row[SheetColumns.GAMIFICACAO.STREAK_ATUAL]),
      maiorStreak: Number(row[SheetColumns.GAMIFICACAO.MAIOR_STREAK]),
      conquistas: achievements
    });
  }

  save(gamificacao) {
    const row = [];
    row[SheetColumns.GAMIFICACAO.ID] = gamificacao.id.value;
    row[SheetColumns.GAMIFICACAO.PACIENTE_ID] = gamificacao.pacienteId.value;
    row[SheetColumns.GAMIFICACAO.XP_TOTAL] = gamificacao.xpTotal;
    row[SheetColumns.GAMIFICACAO.STREAK_ATUAL] = gamificacao.streakAtual;
    row[SheetColumns.GAMIFICACAO.MAIOR_STREAK] = gamificacao.maiorStreak;
    row[SheetColumns.GAMIFICACAO.CONQUISTAS] = JSON.stringify(gamificacao.conquistas);
    this.writeRow(row, gamificacao.id.value, 0);
  }

  update(gamificacao) {
    this.save(gamificacao);
  }
}
