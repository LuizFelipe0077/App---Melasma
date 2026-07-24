import { UUID } from '../../domain/valueObjects/UUID.js';
import { LiberacaoRetroativa, StatusLiberacao } from '../../domain/entities/LiberacaoRetroativa.js';
import { AuditLogger } from '../../shared/logging/AuditLogger.js';

const JANELA_VALIDADE_HORAS = 24;

function inicioDoDia(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export class LiberarRetroativoUseCase {
  #pacienteRepository;
  #liberacaoRepository;

  constructor(pacienteRepository, liberacaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#liberacaoRepository = liberacaoRepository;
  }

  /**
   * Grants a patient authorization to register check-ins for exactly one
   * past calendar date, valid for a fixed 24h window from now.
   * @param {object} input DTO (pacienteId, dataLiberada, motivo, operadorId)
   */
  execute({ pacienteId, dataLiberada, motivo, operadorId }) {
    if (!pacienteId || !dataLiberada || !operadorId) {
      throw new Error('Paciente, data liberada e operador são obrigatórios.');
    }

    const paciente = this.#pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    const dataAlvo = new Date(dataLiberada);
    if (isNaN(dataAlvo.getTime())) {
      throw new Error('Data liberada inválida.');
    }

    if (inicioDoDia(dataAlvo).getTime() > inicioDoDia(new Date()).getTime()) {
      throw new Error('Não é possível liberar uma data futura.');
    }

    if (inicioDoDia(dataAlvo).getTime() < inicioDoDia(paciente.dataInicio).getTime()) {
      throw new Error('Não é possível liberar uma data anterior ao início do tratamento do paciente.');
    }

    const concedidaEm = new Date();
    const expiraEm = new Date(concedidaEm.getTime() + JANELA_VALIDADE_HORAS * 3600000);

    const liberacao = new LiberacaoRetroativa({
      id: UUID.generate(),
      pacienteId: new UUID(pacienteId),
      dataLiberada: dataAlvo,
      concedidaEm,
      expiraEm,
      operadorId,
      motivo: (motivo || '').trim(),
      status: StatusLiberacao.ATIVA,
      usadaEm: null
    });

    this.#liberacaoRepository.save(liberacao);

    AuditLogger.log({
      operadorId,
      tabela: 'LiberacoesRetroativas',
      registroId: liberacao.id.value,
      tipoAcao: 'CREATE',
      dadosNovos: {
        pacienteId, dataLiberada: dataAlvo.toISOString(), concedidaEm: concedidaEm.toISOString(),
        expiraEm: expiraEm.toISOString(), motivo: liberacao.motivo
      },
      motivo: liberacao.motivo || 'Liberação retroativa concedida'
    });

    return {
      liberacaoId: liberacao.id.value,
      dataLiberada: dataAlvo.toISOString(),
      concedidaEm: concedidaEm.toISOString(),
      expiraEm: expiraEm.toISOString()
    };
  }
}
