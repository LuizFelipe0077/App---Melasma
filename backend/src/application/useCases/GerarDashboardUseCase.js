import { UUID } from '../../domain/valueObjects/UUID.js';
import { StatusCheckin } from '../../domain/entities/CheckIn.js';

export class GerarDashboardUseCase {
  #pacienteRepository;
  #protocoloRepository;
  #checkinRepository;

  constructor(pacienteRepository, protocoloRepository, checkinRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#protocoloRepository = protocoloRepository;
    this.#checkinRepository = checkinRepository;
  }

  /**
   * Generates consolidation metrics for a patient.
   * @param {object} input DTO (pacienteId, dataInicio, dataFim)
   */
  async execute({ pacienteId, dataInicio, dataFim }) {
    const pId = new UUID(pacienteId);
    const start = new Date(dataInicio);
    const end = new Date(dataFim);

    // Limit period to 90 days for performance reasons on GAS
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 90) {
      throw new Error('Período de consulta do dashboard não pode exceder 90 dias.');
    }

    const paciente = await this.#pacienteRepository.findById(pId.value);
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

    const protocolo = await this.#protocoloRepository.findById(paciente.protocoloId.value);
    if (!protocolo) {
      throw new Error('Protocolo clínico associado não encontrado.');
    }

    // Fetch all check-ins in the interval
    const checkins = await this.#checkinRepository.findByInterval(pId.value, start, end);

    // Calculate prescribed slots in the period
    let totalPrescrito = 0;
    const historicoAgrupadoPorSuplemento = [];

    for (const suplemento of protocolo.suplementos) {
      const timesPerDay = suplemento.horarios.length;
      // Doses prescribed for this supplement = days * timesPerDay
      const dosesPrescritas = diffDays * timesPerDay;
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

    return {
      pacienteNome: paciente.nome,
      taxaAdesaoGeral,
      totalPrescrito,
      totalConsumido,
      totalAtrasado,
      totalPerdido,
      historicoAgrupadoPorSuplemento
    };
  }
}
