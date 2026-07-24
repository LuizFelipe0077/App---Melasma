/**
 * ObterLiberacaoRetroativaAtivaUseCase.js
 * Patient-facing lookup: is there a currently active retroactive grant for
 * this patient right now? Powers the dashboard card and calendar highlight.
 * Returns null when there is none (expired, revoked, or never granted).
 */
export class ObterLiberacaoRetroativaAtivaUseCase {
  #liberacaoRepository;

  constructor(liberacaoRepository) {
    this.#liberacaoRepository = liberacaoRepository;
  }

  execute({ pacienteId }) {
    const liberacao = this.#liberacaoRepository.findAtivaByPacienteId(pacienteId);
    if (!liberacao) return null;

    return {
      id: liberacao.id.value,
      dataLiberada: liberacao.dataLiberada.toISOString(),
      expiraEm: liberacao.expiraEm.toISOString()
    };
  }
}
