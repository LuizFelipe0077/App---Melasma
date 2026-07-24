import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { LiberacaoRetroativaMapper } from './LiberacaoRetroativaMapper.js';
import { SheetColumns } from './GoogleSheetsColumns.js';

export class GoogleSheetsLiberacaoRetroativaRepository extends GoogleSheetsRepository {
  constructor() {
    super('LiberacoesRetroativas');
  }

  findById(id) {
    const rows = this.readAllRows();
    const row = rows.find(r => r[SheetColumns.LIBERACAO.ID] === id);
    return row ? LiberacaoRetroativaMapper.toDomain(row) : null;
  }

  /**
   * The critical security check: an active grant for this exact patient AND
   * this exact calendar date. Expiration is re-evaluated against the current
   * wall clock on every call (via entity.estaAtiva()), never trusted from a
   * stale `status` cell alone.
   */
  findAtivaParaPacienteEData(pacienteId, data) {
    const rows = this.readAllRows();
    const now = new Date();
    for (const r of rows) {
      if (r[SheetColumns.LIBERACAO.PACIENTE_ID] !== pacienteId) continue;
      const liberacao = LiberacaoRetroativaMapper.toDomain(r);
      if (!liberacao) continue;
      if (liberacao.estaAtiva(now) && liberacao.abrangeData(data)) {
        return liberacao;
      }
    }
    return null;
  }

  /**
   * ALL currently-active grants for this patient, regardless of date —
   * powers the patient-facing card/calendar highlight. A patient can have
   * several simultaneously active grants (different dates, each with its
   * own independent 24h window); sorted by expiraEm ascending so the
   * soonest-to-expire is surfaced first.
   */
  findAllAtivasByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    const now = new Date();
    const matches = rows
      .filter(r => r[SheetColumns.LIBERACAO.PACIENTE_ID] === pacienteId)
      .map(r => LiberacaoRetroativaMapper.toDomain(r))
      .filter(l => l && l.estaAtiva(now));
    return matches.sort((a, b) => a.expiraEm.getTime() - b.expiraEm.getTime());
  }

  findAllByPacienteId(pacienteId) {
    const rows = this.readAllRows();
    const matches = rows
      .filter(r => r[SheetColumns.LIBERACAO.PACIENTE_ID] === pacienteId)
      .map(r => LiberacaoRetroativaMapper.toDomain(r))
      .filter(l => l !== null);
    return matches.sort((a, b) => b.concedidaEm.getTime() - a.concedidaEm.getTime());
  }

  save(liberacao) {
    const row = LiberacaoRetroativaMapper.toRow(liberacao);
    this.writeRow(row, liberacao.id.value, 0);
  }

  update(liberacao) {
    this.save(liberacao);
  }
}
