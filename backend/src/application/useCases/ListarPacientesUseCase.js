import { Paciente } from '../../domain/entities/Paciente.js';

export class ListarPacientesUseCase {
  #pacienteRepository;
  #checkinRepository;

  constructor(pacienteRepository, checkinRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#checkinRepository = checkinRepository;
  }

  /**
   * Retrieves a list of all patients and their general adherence rate.
   * @returns {Promise<Array>} Array of patient objects for the dashboard
   */
  async execute() {
    // 1. Get all patients
    // A proper implementation would use pagination. For MVP, we get all.
    const rows = await this.#pacienteRepository.readAllRows();
    const { PacienteMapper } = await import('../../infrastructure/repositories/PacienteMapper.js');
    const pacientes = rows.map(r => PacienteMapper.toDomain(r)).filter(p => p !== null);

    const checkinsRows = await this.#checkinRepository.readAllRows();
    const { CheckinMapper } = await import('../../infrastructure/repositories/CheckinMapper.js');
    const checkins = checkinsRows.map(r => CheckinMapper.toDomain(r)).filter(c => c !== null);

    // 2. Map patient stats
    return pacientes.map(paciente => {
      // Calculate overall adherence rate
      const pacienteCheckins = checkins.filter(c => c.pacienteId.equals(paciente.id));
      
      const consumido = pacienteCheckins.filter(c => c.status === 'CONCLUIDO').length;
      const atrasado = pacienteCheckins.filter(c => c.status === 'ATRASADO').length;
      const realizado = consumido + atrasado;
      const total = pacienteCheckins.length;
      
      const rate = total > 0 ? Math.round((realizado / total) * 100) : 0;

      return {
        id: paciente.id.value,
        nome: paciente.nome,
        email: paciente.email.value,
        rate: rate
      };
    });
  }
}
