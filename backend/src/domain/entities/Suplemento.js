import { UUID } from '../valueObjects/UUID.js';

/**
 * Suplemento.js
 * Domain Entity representing a prescribed clinical supplement.
 */
export class Suplemento {
  #id;
  #protocoloId;
  #nome;
  #dosagem;
  #horarios; // Array of "HH:MM" strings
  #instrucoes;

  constructor({ id, protocoloId, nome, dosagem, horarios, instrucoes }) {
    if (!(id instanceof UUID)) throw new Error('ID do Suplemento deve ser UUID.');
    if (!(protocoloId instanceof UUID)) throw new Error('ID do Protocolo do Suplemento deve ser UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('Nome do suplemento não pode ser vazio.');
    }
    if (!dosagem || typeof dosagem !== 'string') {
      throw new Error('Dosagem do suplemento inválida.');
    }
    if (!Array.isArray(horarios) || horarios.length === 0) {
      throw new Error('Suplemento deve possuir pelo menos um horário prescrito.');
    }
    
    this.#validateHorarios(horarios);

    this.#id = id;
    this.#protocoloId = protocoloId;
    this.#nome = nome.trim();
    this.#dosagem = dosagem.trim();
    this.#horarios = Object.freeze([...horarios]); // Immutable array
    this.#instrucoes = (instrucoes || '').trim();
  }

  get id() { return this.#id; }
  get protocoloId() { return this.#protocoloId; }
  get nome() { return this.#nome; }
  get dosagem() { return this.#dosagem; }
  get horarios() { return this.#horarios; }
  get instrucoes() { return this.#instrucoes; }

  #validateHorarios(horarios) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (const h of horarios) {
      if (typeof h !== 'string' || !timeRegex.test(h)) {
        throw new Error(`Horário de prescrição inválido (formato esperado HH:MM): ${h}`);
      }
    }
  }
}
