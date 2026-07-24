import { UUID } from '../../domain/valueObjects/UUID.js';
import { CheckIn, StatusCheckin } from '../../domain/entities/CheckIn.js';
import { CheckinRealizadoEvent } from '../../domain/events/CheckinRealizadoEvent.js';
import { eventDispatcher } from '../../domain/events/DomainEventDispatcher.js';
import { Gamificacao } from '../../domain/entities/Gamificacao.js';
import { AuditLogger } from '../../shared/logging/AuditLogger.js';

export class RegistrarCheckinUseCase {
  #pacienteRepository;
  #protocoloRepository;
  #checkinRepository;
  #gamificacaoRepository;
  #liberacaoRepository;

  constructor(pacienteRepository, protocoloRepository, checkinRepository, gamificacaoRepository, liberacaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#protocoloRepository = protocoloRepository;
    this.#checkinRepository = checkinRepository;
    this.#gamificacaoRepository = gamificacaoRepository;
    this.#liberacaoRepository = liberacaoRepository;
  }

  /**
   * Registers a supplement check-in for a patient.
   * @param {object} input DTO (pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada)
   */
  execute({ pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada }) {
    const pId = new UUID(pacienteId);
    const sId = new UUID(suplementoId);
    const datePrescrita = new Date(dataHoraPrescrita);
    const dateRealizada = dataHoraRealizada ? new Date(dataHoraRealizada) : new Date();

    // 1. Fetch and validate patient status
    const paciente = this.#pacienteRepository.findById(pId.value);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }
    paciente.validarStatusPermissaoLogin(); // Throws if INACTIVE or SUSPENDED

    // 2. Fetch supplement to verify it exists
    const suplemento = this.#protocoloRepository.findSuplementoById(sId.value);
    if (!suplemento) {
      throw new Error('Suplemento não cadastrado no protocolo.');
    }

    // 3. Find any existing row for this exact slot. A PENDENTE row (either
    // pre-generated at patient creation, or left behind by a previous
    // cancelarCheckin) is NOT a duplicate — it's reused below instead of
    // creating a second row for the same dose. Only an already-confirmed
    // row (CONCLUIDO/ATRASADO) is a real duplicate.
    const intervalStart = new Date(datePrescrita.getTime() - 60000);
    const intervalEnd = new Date(datePrescrita.getTime() + 60000);
    const existingCheckins = this.#checkinRepository.findByInterval(pId.value, intervalStart, intervalEnd);

    const existingForSlot = existingCheckins.find(c => c.suplementoId.equals(sId));
    if (existingForSlot && existingForSlot.status !== StatusCheckin.PENDENTE) {
      throw new Error('Check-in já registrado para esta dose e horário.');
    }

    // 4. Retroactive gate — resolved entirely server-side. There is no
    // client-supplied flag anywhere in this DTO that can authorize a
    // retroactive check-in; the only source of truth is a grant that
    // matches this exact patient AND this exact calendar date AND is still
    // within its 24h window at the moment of this call.
    const todayStr = new Date().toDateString();
    const prescribedStr = datePrescrita.toDateString();
    let isAllowedRetroactive = false;
    let liberacaoUsada = null;

    if (prescribedStr !== todayStr) {
      liberacaoUsada = this.#liberacaoRepository
        ? this.#liberacaoRepository.findAtivaParaPacienteEData(pId.value, datePrescrita)
        : null;

      if (!liberacaoUsada) {
        throw new Error('Não é possível realizar check-ins retroativos sem uma liberação válida para esta data específica.');
      }
      isAllowedRetroactive = true;
    }

    // 5. Reuse the existing PENDENTE row for this slot if there is one,
    // otherwise instantiate a new Check-in (e.g. a supplement added via
    // adicionarSuplemento has no pre-generated row to reuse).
    const checkin = existingForSlot || new CheckIn({
      id: UUID.generate(),
      pacienteId: pId,
      suplementoId: sId,
      dataHoraPrescrita: datePrescrita,
      dataHoraRealizada: null,
      status: StatusCheckin.PENDENTE,
      retroativo: isAllowedRetroactive
    });

    // 6. Process Ingestion & window tolerance (within the Entity boundary)
    // Default tolerance window is 60 minutes.
    checkin.confirmIngestion(dateRealizada, 60, isAllowedRetroactive);

    // 7. Persist — update the reused row in place, or save a brand new one.
    if (existingForSlot) {
      this.#checkinRepository.update(checkin);
    } else {
      this.#checkinRepository.save(checkin);
    }

    // 7b. Record usage on the grant (audit trail — "utilizada" vs "expirou
    // sem uso") and log the event. marcarUtilizada is idempotent, so a
    // second retroactive check-in against the same grant just reuses the
    // same "first used at" timestamp.
    if (liberacaoUsada) {
      liberacaoUsada.marcarUtilizada(new Date());
      this.#liberacaoRepository.update(liberacaoUsada);
      AuditLogger.log({
        operadorId: pId.value,
        tabela: 'LiberacoesRetroativas',
        registroId: liberacaoUsada.id.value,
        tipoAcao: 'UPDATE',
        dadosNovos: { checkinId: checkin.id.value, suplementoId: sId.value, usadaEm: liberacaoUsada.usadaEm.toISOString() },
        motivo: 'Check-in retroativo registrado usando liberação ativa'
      });
    }

    // 8. Update Gamification aggregates
    let gamificacao = this.#gamificacaoRepository.findByPacienteId(pId.value);
    if (!gamificacao) {
      // Re-create gamification profile if not found
      gamificacao = new Gamificacao({
        id: UUID.generate(),
        pacienteId: pId,
        xpTotal: 0,
        streakAtual: 0,
        maiorStreak: 0,
        conquistas: []
      });
      this.#gamificacaoRepository.save(gamificacao);
    }

    gamificacao.creditarCheckin(checkin.status);
    
    if (checkin.status === StatusCheckin.CONCLUIDO) {
      gamificacao.incrementarStreak();
    } else {
      gamificacao.resetarStreak();
    }

    this.#gamificacaoRepository.update(gamificacao);

    // 9. Dispatch event
    eventDispatcher.dispatch(new CheckinRealizadoEvent(checkin));

    return {
      checkinId: checkin.id.value,
      status: checkin.status,
      streak: gamificacao.streakAtual,
      xpGanho: checkin.status === StatusCheckin.CONCLUIDO ? 10 : 5,
      xpTotal: gamificacao.xpTotal
    };
  }
}
