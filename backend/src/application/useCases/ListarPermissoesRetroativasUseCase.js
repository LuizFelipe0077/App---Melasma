export class ListarPermissoesRetroativasUseCase {
  #permissaoRepository;

  constructor(permissaoRepository) {
    this.#permissaoRepository = permissaoRepository;
  }

  /**
   * Lists the full history of retroactive-edit grants for a patient
   * (not just the currently active one). Admin-only, read-only — no
   * schema change, the PermissoesRetroativas sheet already stores this.
   * @param {object} input DTO (pacienteId)
   */
  execute({ pacienteId }) {
    return this.#permissaoRepository.findAllByPacienteId(pacienteId);
  }
}
