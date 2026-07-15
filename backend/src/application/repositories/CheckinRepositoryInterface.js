/**
 * CheckinRepositoryInterface.js
 * Interface (Contract) for CheckIn persistence operations.
 */
export class CheckinRepositoryInterface {
  findById(id) {
    throw new Error('Método findById não implementado.');
  }

  findByPacienteId(pacienteId) {
    throw new Error('Método findByPacienteId não implementado.');
  }

  findByInterval(pacienteId, startDate, endDate) {
    throw new Error('Método findByInterval não implementado.');
  }

  save(checkin) {
    throw new Error('Método save não implementado.');
  }

  update(checkin) {
    throw new Error('Método update não implementado.');
  }
}
