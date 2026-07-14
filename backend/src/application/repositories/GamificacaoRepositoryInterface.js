/**
 * GamificacaoRepositoryInterface.js
 * Interface (Contract) for Gamificacao stats persistence operations.
 */
export class GamificacaoRepositoryInterface {
  async findByPacienteId(pacienteId) {
    throw new Error('Método findByPacienteId não implementado.');
  }

  async save(gamificacao) {
    throw new Error('Método save não implementado.');
  }

  async update(gamificacao) {
    throw new Error('Método update não implementado.');
  }
}
