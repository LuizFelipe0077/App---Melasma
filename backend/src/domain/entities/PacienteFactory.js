import { Paciente, StatusPaciente } from './Paciente.js';
import { UUID } from '../valueObjects/UUID.js';
import { Email } from '../valueObjects/Email.js';
import { Telefone } from '../valueObjects/Telefone.js';
import { PasswordHash } from '../valueObjects/PasswordHash.js';

/**
 * PacienteFactory.js
 * Factory to safely instantiate a new Paciente Aggregate Root,
 * translating raw strings to specific Domain Value Objects.
 */
export class PacienteFactory {
  /**
   * Creates a new Paciente instance with a random UUID.
   * Typically used when registering a new patient.
   */
  static createNew({ nome, email, telefone, senhaHashString, dataInicio, dataFim }) {
    const id = UUID.generate();
    const emailVO = new Email(email);
    const telefoneVO = new Telefone(telefone);
    const passwordVO = new PasswordHash(senhaHashString);
    
    const start = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
    const end = dataFim instanceof Date ? dataFim : new Date(dataFim);

    return new Paciente({
      id,
      nome,
      email: emailVO,
      telefone: telefoneVO,
      senhaHash: passwordVO,
      protocoloId: null,
      status: StatusPaciente.ATIVO,
      dataInicio: start,
      dataFim: end
    });
  }

  /**
   * Reconstitutes an existing Paciente from persistent storage data (Google Sheets row).
   */
  static reconstitute({ id, nome, email, telefone, senhaHash, protocoloId, status, dataInicio, dataFim }) {
    return new Paciente({
      id: new UUID(id),
      nome,
      email: new Email(email),
      telefone: new Telefone(telefone),
      senhaHash: new PasswordHash(senhaHash),
      protocoloId: protocoloId ? new UUID(protocoloId) : null,
      status,
      dataInicio: new Date(dataInicio),
      dataFim: new Date(dataFim)
    });
  }
}
