/**
 * PacienteRepositoryInterface.js
 * Interface (Contract) for Paciente persistence operations.
 * Must be implemented by specific database adapters in the Infrastructure layer.
 */
export class PacienteRepositoryInterface {
  findById(id) {
    throw new Error('Método findById não implementado.');
  }

  findByEmail(email) {
    throw new Error('Método findByEmail não implementado.');
  }

  save(paciente) {
    throw new Error('Método save não implementado.');
  }

  update(paciente) {
    throw new Error('Método update não implementado.');
  }
}
