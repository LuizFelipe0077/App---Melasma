/**
 * ListarLiberacoesRetroativasAtivasUseCase.js
 * Patient-facing lookup: every currently active retroactive grant for this
 * patient right now (possibly several, one per date, each expiring
 * independently). Powers the dashboard card and calendar highlight.
 * Returns an empty array when there is none.
 */
export class ListarLiberacoesRetroativasAtivasUseCase {
  #liberacaoRepository;

  constructor(liberacaoRepository) {
    this.#liberacaoRepository = liberacaoRepository;
  }

  execute({ pacienteId }) {
    return this.#liberacaoRepository.findAllAtivasByPacienteId(pacienteId).map((liberacao) => ({
      id: liberacao.id.value,
      dataLiberada: liberacao.dataLiberada.toISOString(),
      expiraEm: liberacao.expiraEm.toISOString()
    }));
  }
}
