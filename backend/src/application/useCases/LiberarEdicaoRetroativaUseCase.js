import { UUID } from '../../domain/valueObjects/UUID.js';

export class LiberarEdicaoRetroativaUseCase {
  #pacienteRepository;
  #permissaoRepository;

  constructor(pacienteRepository, permissaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#permissaoRepository = permissaoRepository;
  }

  /**
   * Concedes retroactive check-in permission for a patient.
   * @param {object} input DTO (pacienteId, horasLiberadas, motivo, operadorId)
   */
  async execute({ pacienteId, horasLiberadas, motivo, operadorId }) {
    if (!pacienteId || !horasLiberadas || !motivo || !operadorId) {
      throw new Error('Todos os campos de entrada são obrigatórios.');
    }

    if (horasLiberadas <= 0 || horasLiberadas > 72) {
      throw new Error('Janela de liberação deve ser entre 1 e 72 horas.');
    }

    if (typeof motivo !== 'string' || motivo.trim().length < 10) {
      throw new Error('Motivo clínico da liberação deve possuir pelo menos 10 caracteres.');
    }

    const paciente = await this.#pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + horasLiberadas);

    const permissaoId = UUID.generate();

    const permissao = {
      id: permissaoId.value,
      pacienteId,
      horasLiberadas,
      motivo: motivo.trim(),
      operadorId,
      expiraEm: expiraEm.toISOString(),
      status: 'ATIVA',
      createdAt: new Date().toISOString()
    };

    await this.#permissaoRepository.save(permissao);

    return {
      permissaoId: permissao.id,
      expiraEm: permissao.expiraEm
    };
  }
}
