import { Suplemento } from '../../domain/entities/Suplemento.js';

export class EditarSuplementoUseCase {
  #protocoloRepository;

  constructor(protocoloRepository) {
    this.#protocoloRepository = protocoloRepository;
  }

  /**
   * Edits an existing supplement (name, dosage, schedule, notification, etc.)
   * Additive endpoint — Suplemento is immutable, so this reconstructs the
   * entity with the same id/protocoloId/date range and the updated fields.
   * @param {object} input DTO
   */
  execute({ suplementoId, nome, dosagem, quantidade, tipo, horarios, diasSemana, datasEspecificas, instrucoes, notificacao }) {
    const existing = this.#protocoloRepository.findSuplementoById(suplementoId);
    if (!existing) {
      throw new Error('Suplemento não encontrado.');
    }

    const updated = new Suplemento({
      id: existing.id,
      protocoloId: existing.protocoloId,
      nome: nome ?? existing.nome,
      dosagem: dosagem ?? existing.dosagem,
      horarios: horarios ?? existing.horarios,
      instrucoes: instrucoes ?? existing.instrucoes,
      quantidade: quantidade ?? existing.quantidade,
      diasSemana: diasSemana ?? existing.diasSemana,
      datasEspecificas: datasEspecificas ?? existing.datasEspecificas,
      dataInicio: existing.dataInicio,
      dataFim: existing.dataFim,
      tipo: tipo ?? existing.tipo,
      notificacao: notificacao ?? existing.notificacao
    });

    this.#protocoloRepository.updateSuplemento(updated);

    return { suplementoId: updated.id.value };
  }
}
