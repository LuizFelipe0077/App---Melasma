import { PacienteFactory } from '../../domain/entities/PacienteFactory.js';
import { PacienteCriadoEvent } from '../../domain/events/PacienteCriadoEvent.js';
import { eventDispatcher } from '../../domain/events/DomainEventDispatcher.js';

export class CriarPacienteUseCase {
  #pacienteRepository;
  #criptografiaService;

  constructor(pacienteRepository, criptografiaService) {
    this.#pacienteRepository = pacienteRepository;
    this.#criptografiaService = criptografiaService;
  }

  /**
   * Executes the creation of a new patient.
   * @param {object} input DTO (nome, email, telefone, dataInicio, dataFim)
   * @returns {Promise<object>} output DTO (id, email, senhaTemporaria)
   */
  execute({ nome, email, telefone, dataInicio, dataFim }) {
    // 1. Basic validation
    if (!nome || !email || !telefone || !dataInicio || !dataFim) {
      throw new Error('Todos os campos obrigatórios devem ser fornecidos.');
    }

    // 2. Uniqueness check
    const existingPaciente = this.#pacienteRepository.findByEmail(email);
    if (existingPaciente) {
      throw new Error('Já existe um paciente cadastrado com este e-mail.');
    }

    // 3. Generate secure temporary password
    const tempPassword = this.#generateTempPassword();
    const senhaHashString = this.#criptografiaService.hash(tempPassword);

    // 4. Instantiate Patient via Domain Factory (handles VOs and domain validations)
    const paciente = PacienteFactory.createNew({
      nome,
      email,
      telefone,
      senhaHashString,
      dataInicio,
      dataFim
    });

    // 5. Persist patient to storage
    this.#pacienteRepository.save(paciente);

    // 6. Dispatch Domain Event for collateral actions (like sending email)
    eventDispatcher.dispatch(new PacienteCriadoEvent(paciente, tempPassword));

    // 7. Return safe Output DTO
    return {
      id: paciente.id.value,
      email: paciente.email.value,
      senhaTemporaria: tempPassword
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
