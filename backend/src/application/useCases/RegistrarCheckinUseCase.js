import { UUID } from '../../domain/valueObjects/UUID.js';
import { CheckIn, StatusCheckin } from '../../domain/entities/CheckIn.js';
import { CheckinRealizadoEvent } from '../../domain/events/CheckinRealizadoEvent.js';
import { eventDispatcher } from '../../domain/events/DomainEventDispatcher.js';

export class RegistrarCheckinUseCase {
  #pacienteRepository;
  #protocoloRepository;
  #checkinRepository;
  #gamificacaoRepository;

  constructor(pacienteRepository, protocoloRepository, checkinRepository, gamificacaoRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#protocoloRepository = protocoloRepository;
    this.#checkinRepository = checkinRepository;
    this.#gamificacaoRepository = gamificacaoRepository;
  }

  /**
   * Registers a supplement check-in for a patient.
   * @param {object} input DTO (pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada, forceRetroactive)
   */
  async execute({ pacienteId, suplementoId, dataHoraPrescrita, dataHoraRealizada, forceRetroactive = false }) {
    const pId = new UUID(pacienteId);
    const sId = new UUID(suplementoId);
    const datePrescrita = new Date(dataHoraPrescrita);
    const dateRealizada = dataHoraRealizada ? new Date(dataHoraRealizada) : new Date();

    // 1. Fetch and validate patient status
    const paciente = await this.#pacienteRepository.findById(pId.value);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }
    paciente.validarStatusPermissaoLogin(); // Throws if INACTIVE or SUSPENDED

    // 2. Fetch supplement to verify it exists
    const suplemento = await this.#protocoloRepository.findSuplementoById(sId.value);
    if (!suplemento) {
      throw new Error('Suplemento não cadastrado no protocolo.');
    }

    // 3. Prevent duplicate check-ins for the same prescribed slot
    const intervalStart = new Date(datePrescrita.getTime() - 60000);
    const intervalEnd = new Date(datePrescrita.getTime() + 60000);
    const existingCheckins = await this.#checkinRepository.findByInterval(pId.value, intervalStart, intervalEnd);
    
    const duplicate = existingCheckins.some(c => c.suplementoId.equals(sId));
    if (duplicate) {
      throw new Error('Check-in já registrado para esta dose e horário.');
    }

    // 4. Check for retroactive blocks (midnight rule)
    const todayStr = new Date().toDateString();
    const prescribedStr = datePrescrita.toDateString();
    if (prescribedStr !== todayStr && !forceRetroactive) {
      throw new Error('Não é possível realizar check-ins retroativos de dias anteriores sem liberação do clínico.');
    }

    // 5. Instantiate Check-in
    const checkin = new CheckIn({
      id: UUID.generate(),
      pacienteId: pId,
      suplementoId: sId,
      dataHoraPrescrita: datePrescrita,
      dataHoraRealizada: null,
      status: StatusCheckin.PENDENTE,
      retroativo: forceRetroactive
    });

    // 6. Process Ingestion & window tolerance (within the Entity boundary)
    // Default tolerance window is 60 minutes.
    checkin.confirmIngestion(dateRealizada, 60, forceRetroactive);

    // 7. Save Check-in
    await this.#checkinRepository.save(checkin);

    // 8. Update Gamification aggregates
    let gamificacao = await this.#gamificacaoRepository.findByPacienteId(pId.value);
    if (!gamificacao) {
      // Re-create gamification profile if not found
      const { Gamificacao } = await import('../../domain/entities/Gamificacao.js');
      gamificacao = new Gamificacao({
        id: UUID.generate(),
        pacienteId: pId,
        xpTotal: 0,
        streakAtual: 0,
        maiorStreak: 0,
        conquistas: []
      });
      await this.#gamificacaoRepository.save(gamificacao);
    }

    gamificacao.creditarCheckin(checkin.status);
    
    if (checkin.status === StatusCheckin.CONCLUIDO) {
      gamificacao.incrementarStreak();
    } else {
      gamificacao.resetarStreak();
    }

    await this.#gamificacaoRepository.update(gamificacao);

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
