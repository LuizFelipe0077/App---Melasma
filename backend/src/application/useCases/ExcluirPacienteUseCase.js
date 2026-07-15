import { UUID } from '../../domain/valueObjects/UUID.js';

export class ExcluirPacienteUseCase {
  #pacienteRepository;

  constructor(pacienteRepository) {
    this.#pacienteRepository = pacienteRepository;
  }

  /**
   * Executes deletion of a patient.
   * @param {object} input DTO
   */
  async execute({ id }) {
    if (!id) {
      throw new Error('ID do paciente é obrigatório para exclusão.');
    }

    const paciente = this.#pacienteRepository.findById(id);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    this.#pacienteRepository.delete(id);

    return {
      success: true,
      message: 'Paciente excluído com sucesso.'
    };
  }
}
