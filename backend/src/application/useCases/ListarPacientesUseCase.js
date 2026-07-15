import { Paciente } from '../../domain/entities/Paciente.js';
import { PacienteMapper } from '../../infrastructure/repositories/PacienteMapper.js';
import { CheckinMapper } from '../../infrastructure/repositories/CheckinMapper.js';

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
  execute() {
    // 1. Get all patients
    // A proper implementation would use pagination. For MVP, we get all.
    const rows = this.#pacienteRepository.readAllRows();
    const pacientes = rows.map(r => PacienteMapper.toDomain(r)).filter(p => p !== null);

    const checkinsRows = this.#checkinRepository.readAllRows();
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
        telefone: paciente.telefone.value,
        status: paciente.status,
        dataInicio: paciente.dataInicio.toISOString().split('T')[0],
        dataFim: paciente.dataFim.toISOString().split('T')[0],
        senhaHash: paciente.senhaHash.value,
        rate: rate
      };
    });
  }
}
