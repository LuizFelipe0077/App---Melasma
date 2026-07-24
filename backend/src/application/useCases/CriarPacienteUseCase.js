import { PacienteFactory } from '../../domain/entities/PacienteFactory.js';
import { PacienteCriadoEvent } from '../../domain/events/PacienteCriadoEvent.js';
import { eventDispatcher } from '../../domain/events/DomainEventDispatcher.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { Protocolo } from '../../domain/entities/Protocolo.js';
import { Suplemento } from '../../domain/entities/Suplemento.js';
import { CheckIn, StatusCheckin } from '../../domain/entities/CheckIn.js';
import { isDayActive } from '../../shared/utils/ScheduleMatcher.js';

export class CriarPacienteUseCase {
  #pacienteRepository;
  #criptografiaService;
  #protocoloRepository;
  #checkinRepository;

  constructor(pacienteRepository, criptografiaService, protocoloRepository, checkinRepository) {
    this.#pacienteRepository = pacienteRepository;
    this.#criptografiaService = criptografiaService;
    this.#protocoloRepository = protocoloRepository;
    this.#checkinRepository = checkinRepository;
  }

  /**
   * Executes the creation of a new patient.
   * @param {object} input DTO
   */
  execute({ nome, email, telefone, senha, dataInicio, dataFim, protocoloNome, observacoes, suplementos }) {
    // 1. Basic validation
    if (!nome || !email || !telefone || !senha || !dataInicio || !dataFim) {
      throw new Error('Todos os campos obrigatórios (incluindo senha) devem ser fornecidos.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSenha = senha.trim();

    if (cleanSenha.length < 4) {
      throw new Error('A senha deve possuir pelo menos 4 caracteres.');
    }

    // 2. Uniqueness check
    const existingPaciente = this.#pacienteRepository.findByEmail(cleanEmail);
    if (existingPaciente) {
      throw new Error('Já existe um paciente cadastrado com este e-mail.');
    }

    // 3. Hash the manual password
    const senhaHashString = this.#criptografiaService.hash(cleanSenha);

    // 4. Instantiate Patient via Domain Factory (handles VOs and domain validations)
    const paciente = PacienteFactory.createNew({
      nome,
      email: cleanEmail,
      telefone,
      senhaHashString,
      dataInicio,
      dataFim,
      protocoloNome,
      observacoes
    });

    // 5. Create protocol custom ID and link to patient
    const protocoloId = UUID.generate();
    paciente.vincularProtocolo(protocoloId);

    // 6. Map and create Supplements
    const durationMs = Math.abs(new Date(dataFim) - new Date(dataInicio));
    const duracaoDias = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

    const supplementEntities = (suplementos || []).map(s => {
      return new Suplemento({
        id: UUID.generate(),
        protocoloId: protocoloId,
        nome: s.nome,
        dosagem: s.dosagem,
        horarios: s.horarios,
        instrucoes: s.instrucoes || '',
        quantidade: s.quantidade,
        diasSemana: s.diasSemana,
        datasEspecificas: s.datasEspecificas,
        dataInicio: new Date(s.dataInicio || dataInicio),
        dataFim: new Date(s.dataFim || dataFim),
        tipo: s.tipo,
        notificacao: s.notificacao
      });
    });

    const protocolo = new Protocolo({
      id: protocoloId,
      nome: protocoloNome || 'Melasma',
      suplementos: supplementEntities,
      duracaoDias: Math.max(1, Math.min(duracaoDias, 365))
    });

    // 7. Save custom Protocol and Supplements
    if (this.#protocoloRepository) {
      this.#protocoloRepository.save(protocolo);
    }

    // 8. Generate automated Checkins
    const generatedCheckins = [];
    for (const sup of supplementEntities) {
      const sStart = new Date(sup.dataInicio);
      const sEnd = new Date(sup.dataFim);

      let current = new Date(sStart);
      while (current <= sEnd) {
        if (isDayActive(current, sStart, sup.diasSemana, sup.datasEspecificas)) {
          for (const slot of sup.horarios) {
            const prescribedTime = new Date(current);
            const [h, m] = slot.split(':');
            prescribedTime.setHours(Number(h), Number(m), 0, 0);

            generatedCheckins.push(new CheckIn({
              id: UUID.generate(),
              pacienteId: paciente.id,
              suplementoId: sup.id,
              dataHoraPrescrita: prescribedTime,
              dataHoraRealizada: null,
              status: StatusCheckin.PENDENTE,
              retroativo: false
            }));
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    // 9. Batch save checkins
    if (this.#checkinRepository && generatedCheckins.length > 0) {
      this.#checkinRepository.saveAll(generatedCheckins);
    }

    // 10. Persist patient to storage
    this.#pacienteRepository.save(paciente);

    // 11. Dispatch Domain Event
    eventDispatcher.dispatch(new PacienteCriadoEvent(paciente, cleanSenha));

    // 12. Return safe Output DTO
    return {
      id: paciente.id.value,
      email: paciente.email.value,
      senha: cleanSenha
    };
  }

  /**
   * Generates a cryptographically secure temporary password.
   * Uses Web Crypto API when available (CWE-330 mitigation).
   */
  #generateTempPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pass = '';
    const length = 14; // 14 chars for higher entropy

    // Prefer CSPRNG (crypto.getRandomValues)
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.getRandomValues) {
      const randomBytes = new Uint8Array(length);
      globalThis.crypto.getRandomValues(randomBytes);
      for (let i = 0; i < length; i++) {
        pass += chars.charAt(randomBytes[i] % chars.length);
      }
    } else {
      // Fallback for GAS: use Utilities.getUuid() as entropy seed
      if (typeof Utilities !== 'undefined') {
        const uuid = Utilities.getUuid().replace(/-/g, '');
        for (let i = 0; i < length; i++) {
          pass += chars.charAt(uuid.charCodeAt(i % uuid.length) % chars.length);
        }
      } else {
        for (let i = 0; i < length; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
    }
    return pass;
  }
}
