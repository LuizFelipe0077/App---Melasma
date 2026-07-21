import { UUID } from '../../domain/valueObjects/UUID.js';
import { Suplemento } from '../../domain/entities/Suplemento.js';

export class AdicionarSuplementoUseCase {
  #pacienteRepository;
  #protocoloRepository;

  constructor(pacienteRepository, protocoloRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#protocoloRepository = protocoloRepository;
  }

  /**
   * Adds a new supplement to an already-registered patient's protocol.
   * Additive endpoint — does not touch criarPaciente's flow or contract.
   * @param {object} input DTO
   */
  execute({ pacienteId, nome, dosagem, quantidade, tipo, horarios, diasSemana, instrucoes, notificacao, dataInicio, dataFim }) {
    const paciente = this.#pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }
    if (!paciente.protocoloId) {
      throw new Error('Paciente não possui protocolo vinculado.');
    }

    const suplemento = new Suplemento({
      id: UUID.generate(),
      protocoloId: paciente.protocoloId,
      nome,
      dosagem,
      horarios,
      instrucoes: instrucoes || '',
      quantidade,
      diasSemana,
      dataInicio: dataInicio ? new Date(dataInicio) : paciente.dataInicio,
      dataFim: dataFim ? new Date(dataFim) : paciente.dataFim,
      tipo,
      notificacao
    });

    this.#protocoloRepository.addSuplemento(suplemento);

    return { suplementoId: suplemento.id.value };
  }
}
