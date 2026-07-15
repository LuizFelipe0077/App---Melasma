import { Paciente, StatusPaciente } from './Paciente.js';
import { UUID } from '../valueObjects/UUID.js';
import { Email } from '../valueObjects/Email.js';
import { Telefone } from '../valueObjects/Telefone.js';
import { PasswordHash } from '../valueObjects/PasswordHash.js';

function safeParseDate(val) {
  if (val instanceof Date) return val;
  if (!val) return new Date();
  
  const str = String(val).trim();
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    return new Date(year, month, day);
  }
  return new Date(val);
}

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
  static createNew({ nome, email, telefone, senhaHashString, dataInicio, dataFim, protocoloNome, observacoes }) {
    const id = UUID.generate();
    const emailVO = new Email(email);
    const telefoneVO = new Telefone(telefone);
    const passwordVO = new PasswordHash(senhaHashString);
    
    const start = safeParseDate(dataInicio);
    const end = safeParseDate(dataFim);

    return new Paciente({
      id,
      nome,
      email: emailVO,
      telefone: telefoneVO,
      senhaHash: passwordVO,
      protocoloId: null,
      status: StatusPaciente.ATIVO,
      dataInicio: start,
      dataFim: end,
      protocoloNome: protocoloNome || 'Melasma',
      observacoes: observacoes || ''
    });
  }

  /**
   * Reconstitutes an existing Paciente from persistent storage data (Google Sheets row).
   */
  static reconstitute({ id, nome, email, telefone, senhaHash, protocoloId, status, dataInicio, dataFim, protocoloNome, observacoes }) {
    return new Paciente({
      id: new UUID(id),
      nome,
      email: new Email(email),
      telefone: new Telefone(telefone),
      senhaHash: new PasswordHash(senhaHash),
      protocoloId: protocoloId ? new UUID(protocoloId) : null,
      status,
      dataInicio: safeParseDate(dataInicio),
      dataFim: safeParseDate(dataFim),
      protocoloNome: protocoloNome || 'Melasma',
      observacoes: observacoes || ''
    });
  }
}
