import { StatusCheckin } from '../../domain/entities/CheckIn.js';

export class CancelarCheckinUseCase {
  #checkinRepository;
  #gamificacaoRepository;

  constructor(checkinRepository, gamificacaoRepository) {
    this.#checkinRepository = checkinRepository;
    this.#gamificacaoRepository = gamificacaoRepository;
  }

  /**
   * Reverts a previously registered check-in back to PENDENTE, undoing the
   * gamification credit it had earned. Additive endpoint — see
   * ARCHITECTURE_NOTES.md for why this exists (the domain already had
   * CheckIn.revert(), but no route ever called it).
   * @param {object} input DTO ({ userId, role, checkinId })
   */
  execute({ userId, role, checkinId }) {
    const checkin = this.#checkinRepository.findById(checkinId);
    if (!checkin) {
      throw new Error('Check-in não encontrado.');
    }

    if (role !== 'ADMIN' && checkin.pacienteId.value !== userId) {
      throw new Error('Acesso negado. Este check-in não pertence a você.');
    }

    if (checkin.status === StatusCheckin.PENDENTE) {
      throw new Error('Este check-in ainda não foi realizado.');
    }

    const previousStatus = checkin.status;
    checkin.revert();
    this.#checkinRepository.update(checkin);

    const gamificacao = this.#gamificacaoRepository.findByPacienteId(checkin.pacienteId.value);
    if (gamificacao) {
      gamificacao.debitarCheckin(previousStatus);
      if (previousStatus === StatusCheckin.CONCLUIDO) {
        gamificacao.decrementarStreak();
      }
      this.#gamificacaoRepository.update(gamificacao);
    }

    return {
      success: true,
      xpTotal: gamificacao ? gamificacao.xpTotal : 0,
      streakAtual: gamificacao ? gamificacao.streakAtual : 0
    };
  }
}
