/**
 * ProtocoloRepositoryInterface.js
 * Interface (Contract) for Protocolo and Suplemento read/write operations.
 */
export class ProtocoloRepositoryInterface {
  async findById(id) {
    throw new Error('Método findById não implementado.');
  }

  async save(protocolo) {
    throw new Error('Método save não implementado.');
  }

  async findSuplementoById(suplementoId) {
    throw new Error('Método findSuplementoById não implementado.');
  }

  async findSuplementosByProtocoloId(protocoloId) {
    throw new Error('Método findSuplementosByProtocoloId não implementado.');
  }
}
