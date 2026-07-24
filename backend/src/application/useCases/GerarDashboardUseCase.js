import { UUID } from '../../domain/valueObjects/UUID.js';
import { StatusCheckin } from '../../domain/entities/CheckIn.js';
import { isDayActive } from '../../shared/utils/ScheduleMatcher.js';

function countPrescribedDoses(suplemento, start, end) {
  let count = 0;
  const current = new Date(start);
  const sStart = new Date(suplemento.dataInicio);
  const sEnd = new Date(suplemento.dataFim);

  while (current <= end) {
    if (current >= sStart && current <= sEnd) {
      if (isDayActive(current, sStart, suplemento.diasSemana, suplemento.datasEspecificas)) {
        count += suplemento.horarios.length;
      }
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

export class GerarDashboardUseCase {
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
   * Generates consolidation metrics for a patient.
   * @param {object} input DTO (pacienteId, dataInicio, dataFim)
   */
  execute({ pacienteId, dataInicio, dataFim }) {
    const pId = new UUID(pacienteId);
    const start = new Date(dataInicio);
    const end = new Date(dataFim);

    // Limit period to 90 days for performance reasons on GAS
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      throw new Error('Período de consulta do dashboard não pode exceder 90 dias.');
    }

    const paciente = this.#pacienteRepository.findById(pId.value);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    if (!paciente.protocoloId) {
      return {
        pacienteNome: paciente.nome,
        taxaAdesaoGeral: 0,
        totalPrescrito: 0,
        totalConsumido: 0,
        totalAtrasado: 0,
        totalPerdido: 0,
        historicoAgrupadoPorSuplemento: []
      };
    }

    const protocolo = this.#protocoloRepository.findById(paciente.protocoloId.value);
    if (!protocolo) {
      throw new Error('Protocolo clínico associado não encontrado.');
    }

    // Fetch all check-ins in the interval
    const checkins = this.#checkinRepository.findByInterval(pId.value, start, end);

    // Calculate prescribed slots in the period
    let totalPrescrito = 0;
    const historicoAgrupadoPorSuplemento = [];

    for (const suplemento of protocolo.suplementos) {
      const dosesPrescritas = countPrescribedDoses(suplemento, start, end);
      totalPrescrito += dosesPrescritas;

      // Filter check-ins for this supplement
      const supCheckins = checkins.filter(c => c.suplementoId.equals(suplemento.id));
      const consumidos = supCheckins.filter(c => c.status === StatusCheckin.CONCLUIDO).length;
      const atrasados = supCheckins.filter(c => c.status === StatusCheckin.ATRASADO).length;
      const totalConsumidos = consumidos + atrasados;
      const perdidos = Math.max(0, dosesPrescritas - totalConsumidos);
      
      const taxaAdesao = dosesPrescritas > 0 
        ? Math.round((totalConsumidos / dosesPrescritas) * 100) 
        : 0;

      historicoAgrupadoPorSuplemento.push({
        suplementoId: suplemento.id.value,
        nome: suplemento.nome,
        dosagem: suplemento.dosagem,
        horarios: suplemento.horarios,
        instrucoes: suplemento.instrucoes,
        diasSemana: suplemento.diasSemana,
        datasEspecificas: suplemento.datasEspecificas.map((d) => d.toISOString()),
        tipo: suplemento.tipo,
        prescrito: dosesPrescritas,
        consumido: consumidos,
        atrasado: atrasados,
        perdido: perdidos,
        taxaAdesao
      });
    }

    const totalConsumido = checkins.filter(c => c.status === StatusCheckin.CONCLUIDO).length;
    const totalAtrasado = checkins.filter(c => c.status === StatusCheckin.ATRASADO).length;
    const totalRealizado = totalConsumido + totalAtrasado;
    const totalPerdido = Math.max(0, totalPrescrito - totalRealizado);

    const taxaAdesaoGeral = totalPrescrito > 0 
      ? Math.round((totalRealizado / totalPrescrito) * 100) 
      : 0;

    const gamificacao = this.#gamificacaoRepository 
      ? this.#gamificacaoRepository.findByPacienteId(pacienteId)
      : null;

    const rawCheckins = checkins.map(c => ({
      id: c.id.value,
      suplementoId: c.suplementoId.value,
      dataHoraPrescrita: c.dataHoraPrescrita.toISOString(),
      dataHoraRealizada: c.dataHoraRealizada ? c.dataHoraRealizada.toISOString() : null,
      status: c.status,
      retroativo: c.retroativo
    }));

    return {
      pacienteNome: paciente.nome,
      taxaAdesaoGeral,
      totalPrescrito,
      totalConsumido,
      totalAtrasado,
      totalPerdido,
      historicoAgrupadoPorSuplemento,
      rawCheckins,
      gamificacao: gamificacao ? {
        xpTotal: gamificacao.xpTotal,
        streakAtual: gamificacao.streakAtual,
        maiorStreak: gamificacao.maiorStreak,
        conquistas: gamificacao.conquistas
      } : null
    };
  }
}
