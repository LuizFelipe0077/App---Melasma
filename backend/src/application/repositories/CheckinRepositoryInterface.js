/**
 * CheckinRepositoryInterface.js
 * Interface (Contract) for CheckIn persistence operations.
 */
export class CheckinRepositoryInterface {
  async findById(id) {
    throw new Error('Método findById não implementado.');
  }

  async findByPacienteId(pacienteId) {
    throw new Error('Método findByPacienteId não implementado.');
  }

  async findByInterval(pacienteId, startDate, endDate) {
    throw new Error('Método findByInterval não implementado.');
  }

  async save(checkin) {
    throw new Error('Método save não implementado.');
  }

  async update(checkin) {
    throw new Error('Método update não implementado.');
  }
}
