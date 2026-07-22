export class ListarObservacoesClinicasUseCase {
  #observacaoRepository;

  constructor(observacaoRepository) {
    this.#observacaoRepository = observacaoRepository;
  }

  /**
   * Lists all clinical notes for a patient, newest first. Admin-only.
   * @param {object} input DTO (pacienteId)
   */
  execute({ pacienteId }) {
    return this.#observacaoRepository.findByPacienteId(pacienteId);
  }
}
