import { PacienteFactory } from '../../domain/entities/PacienteFactory.js';
import { UUID } from '../../domain/valueObjects/UUID.js';
import { Email } from '../../domain/valueObjects/Email.js';
import { Telefone } from '../../domain/valueObjects/Telefone.js';
import { PasswordHash } from '../../domain/valueObjects/PasswordHash.js';

export class EditarPacienteUseCase {
  #pacienteRepository;
  #criptografiaService;

  constructor(pacienteRepository, criptografiaService) {
    this.#pacienteRepository = pacienteRepository;
    this.#criptografiaService = criptografiaService;
  }

  /**
   * Executes the editing of an existing patient.
   * @param {object} input DTO
   */
  async execute({ id, nome, email, telefone, dataInicio, dataFim, status, senha }) {
    if (!id || !nome || !email || !telefone || !dataInicio || !dataFim || !status) {
      throw new Error('Parâmetros obrigatórios ausentes.');
    }

    const paciente = this.#pacienteRepository.findById(id);
    if (!paciente) {
      throw new Error('Paciente não encontrado.');
    }

    // Email duplication check (if changed)
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== paciente.email.value) {
      const existing = this.#pacienteRepository.findByEmail(cleanEmail);
      if (existing) {
        throw new Error('Este e-mail já está sendo usado por outro paciente.');
      }
    }

    // Password handling
    let finalSenhaHash = paciente.senhaHash.value;
    if (senha && senha.trim().length > 0) {
      finalSenhaHash = this.#criptografiaService.hash(senha.trim());
    }

    // Reconstitute domain object to enforce validations
    const updatedPaciente = PacienteFactory.reconstitute({
      id: paciente.id.value,
      nome,
      email: cleanEmail,
      telefone,
      senhaHash: finalSenhaHash,
      protocoloId: paciente.protocoloId ? paciente.protocoloId.value : null,
      status,
      dataInicio,
      dataFim
    });

    this.#pacienteRepository.update(updatedPaciente);

    return {
      id: updatedPaciente.id.value,
      nome: updatedPaciente.nome,
      email: updatedPaciente.email.value
    };
  }
}
