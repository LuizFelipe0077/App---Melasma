/**
 * ListarLiberacoesRetroativasUseCase.js
 * Read-only, admin-facing full grant history for a patient (newest first).
 */
export class ListarLiberacoesRetroativasUseCase {
  #liberacaoRepository;

  constructor(liberacaoRepository) {
    this.#liberacaoRepository = liberacaoRepository;
  }

  execute({ pacienteId }) {
    const liberacoes = this.#liberacaoRepository.findAllByPacienteId(pacienteId);
    const now = new Date();
    return liberacoes.map((l) => ({
      id: l.id.value,
      pacienteId: l.pacienteId.value,
      dataLiberada: l.dataLiberada.toISOString(),
      concedidaEm: l.concedidaEm.toISOString(),
      expiraEm: l.expiraEm.toISOString(),
      operadorId: l.operadorId,
      motivo: l.motivo,
      status: l.status,
      usadaEm: l.usadaEm ? l.usadaEm.toISOString() : null,
      ativa: l.estaAtiva(now)
    }));
  }
}
