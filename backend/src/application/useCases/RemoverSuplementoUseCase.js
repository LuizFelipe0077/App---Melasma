export class RemoverSuplementoUseCase {
  #protocoloRepository;

  constructor(protocoloRepository) {
    this.#protocoloRepository = protocoloRepository;
  }

  /**
   * Removes a supplement from a patient's protocol. Historical check-ins
   * tied to it are intentionally left untouched (audit trail).
   * @param {object} input DTO ({ suplementoId })
   */
  execute({ suplementoId }) {
    const existing = this.#protocoloRepository.findSuplementoById(suplementoId);
    if (!existing) {
      throw new Error('Suplemento não encontrado.');
    }

    this.#protocoloRepository.removeSuplemento(suplementoId);

    return { success: true };
  }
}
