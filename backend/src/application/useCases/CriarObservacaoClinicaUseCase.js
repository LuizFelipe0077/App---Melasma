import { UUID } from '../../domain/valueObjects/UUID.js';

const TIPOS_VALIDOS = [
  'OBSERVACAO', 'REACAO', 'MUDANCA', 'SOLICITACAO', 'RETORNO',
  // Intervenções (reaproveita o mesmo armazenamento de observações clínicas)
  'CONTATO', 'MUDANCA_PROTOCOLO', 'ORIENTACAO', 'FEEDBACK'
];

export class CriarObservacaoClinicaUseCase {
  #pacienteRepository;
  #observacaoRepository;

  constructor(pacienteRepository, observacaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#observacaoRepository = observacaoRepository;
  }

  /**
   * Records an admin-only clinical note against a patient. Never exposed to
   * the patient-facing actions (gerarDashboard, etc).
   * @param {object} input DTO (pacienteId, operadorId, texto, tipo)
   */
  execute({ pacienteId, operadorId, texto, tipo }) {
    if (!texto || typeof texto !== 'string' || texto.trim().length < 3) {
      throw new Error('O texto da observação deve possuir pelo menos 3 caracteres.');
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      throw new Error(`Tipo de observação inválido: ${tipo}`);
    }

    const paciente = this.#pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    const observacao = {
      id: UUID.generate().value,
      pacienteId,
      operadorId,
      texto: texto.trim(),
      tipo,
      createdAt: new Date().toISOString()
    };

    this.#observacaoRepository.save(observacao);

    return { id: observacao.id };
  }
}
