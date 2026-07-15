/**
 * ProtocoloRepositoryInterface.js
 * Interface (Contract) for Protocolo and Suplemento read/write operations.
 */
export class ProtocoloRepositoryInterface {
  findById(id) {
    throw new Error('Método findById não implementado.');
  }

  save(protocolo) {
    throw new Error('Método save não implementado.');
  }

  findSuplementoById(suplementoId) {
    throw new Error('Método findSuplementoById não implementado.');
  }

  findSuplementosByProtocoloId(protocoloId) {
    throw new Error('Método findSuplementosByProtocoloId não implementado.');
  }
}
