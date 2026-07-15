import { UUID } from '../valueObjects/UUID.js';
import { Email } from '../valueObjects/Email.js';
import { Telefone } from '../valueObjects/Telefone.js';
import { PasswordHash } from '../valueObjects/PasswordHash.js';

export const StatusPaciente = {
  ATIVO: 'ATIVO',
  INATIVO: 'INATIVO',
  SUSPENSO: 'SUSPENSO',
  ANONIMIZADO: 'ANONIMIZADO'
};

/**
 * Paciente.js
 * Domain Entity representing a patient undergoing treatment.
 */
export class Paciente {
  #id;
  #nome;
  #email;
  #telefone;
  #senhaHash;
  #protocoloId;
  #status;
  #dataInicio;
  #dataFim;

  constructor({ id, nome, email, telefone, senhaHash, protocoloId, status, dataInicio, dataFim }) {
    if (!(id instanceof UUID)) throw new Error('ID do Paciente deve ser uma instância de UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
      throw new Error('Nome do Paciente inválido (mínimo de 3 caracteres).');
    }
    if (!(email instanceof Email)) throw new Error('E-mail do Paciente deve ser uma instância de Email.');
    if (!(telefone instanceof Telefone)) throw new Error('Telefone do Paciente deve ser uma instância de Telefone.');
    if (!(senhaHash instanceof PasswordHash)) throw new Error('Senha hash deve ser uma instância de PasswordHash.');
    
    if (protocoloId && !(protocoloId instanceof UUID)) {
      throw new Error('ID do Protocolo deve ser uma instância de UUID ou nulo.');
    }
    
    if (!Object.values(StatusPaciente).includes(status)) {
      throw new Error(`Status do Paciente inválido: ${status}`);
    }

    if (!(dataInicio instanceof Date) || !(dataFim instanceof Date)) {
      throw new Error('As datas de início e fim do tratamento devem ser instâncias de Date.');
    }

    if (dataFim < dataInicio) {
      throw new Error('A data de término não pode ser anterior à data de início do tratamento.');
    }

    this.#id = id;
    this.#nome = nome.trim();
    this.#email = email;
    this.#telefone = telefone;
    this.#senhaHash = senhaHash;
    this.#protocoloId = protocoloId || null;
    this.#status = status;
    this.#dataInicio = dataInicio;
    this.#dataFim = dataFim;
  }

  // Getters
  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get email() { return this.#email; }
  get telefone() { return this.#telefone; }
  get senhaHash() { return this.#senhaHash; }
  get protocoloId() { return this.#protocoloId; }
  get status() { return this.#status; }
  get dataInicio() { return this.#dataInicio; }
  get dataFim() { return this.#dataFim; }

  // Domain Actions
  ativar() {
    this.#status = StatusPaciente.ATIVO;
  }

  inativar() {
    this.#status = StatusPaciente.INATIVO;
  }

  suspender() {
    this.#status = StatusPaciente.SUSPENSO;
  }

  /**
   * Applies anonymization data to the domain entity.
   * This is part of the LGPD compliance workflow.
   * @param {object} dadosAnonimizados 
   */
  atualizarDadosParaAnonimizacao({ nome, email, telefone, senhaHash, status }) {
    this.#nome = nome;
    this.#email = new Email(email);
    this.#telefone = new Telefone(telefone);
    this.#senhaHash = new PasswordHash(senhaHash);
    this.#status = status;
  }

  vincularProtocolo(protocoloId) {
    if (!(protocoloId instanceof UUID)) {
      throw new Error('ID do Protocolo a vincular deve ser uma instância de UUID.');
    }
    this.#protocoloId = protocoloId;
  }

  validarStatusPermissaoLogin() {
    if (this.#status === StatusPaciente.INATIVO) {
      throw new Error('Esta conta está inativa. Entre em contato com seu clínico.');
    }
    if (this.#status === StatusPaciente.SUSPENSO) {
      throw new Error('Esta conta está temporariamente bloqueada por segurança.');
    }
    
    const hoje = new Date();
    if (hoje < this.#dataInicio) {
      throw new Error('Seu período de tratamento ainda não iniciou.');
    }
    if (hoje > this.#dataFim) {
      throw new Error('Seu período de tratamento já expirou.');
    }
    return true;
  }
}
