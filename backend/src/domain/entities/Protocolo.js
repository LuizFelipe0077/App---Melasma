import { UUID } from '../valueObjects/UUID.js';
import { Suplemento } from './Suplemento.js';

/**
 * Protocolo.js
 * Domain Aggregate Root representing a clinical treatment protocol.
 */
export class Protocolo {
  #id;
  #nome;
  #suplementos; // Array of Suplemento entities
  #duracaoDias;

  constructor({ id, nome, suplementos, duracaoDias }) {
    if (!(id instanceof UUID)) throw new Error('ID do Protocolo deve ser UUID.');
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('Nome do protocolo não pode ser vazio.');
    }
    if (!Number.isInteger(duracaoDias) || duracaoDias <= 0 || duracaoDias > 365) {
      throw new Error('A duração do protocolo deve ser entre 1 e 365 dias.');
    }

    this.#id = id;
    this.#nome = nome.trim();
    this.#suplementos = Array.isArray(suplementos) ? suplementos : [];
    this.#duracaoDias = duracaoDias;
  }

  get id() { return this.#id; }
  get nome() { return this.#nome; }
  get suplementos() { return this.#suplementos; }
  get duracaoDias() { return this.#duracaoDias; }

  adicionarSuplemento(suplemento) {
    if (!(suplemento instanceof Suplemento)) {
      throw new Error('O item adicionado deve ser uma instância de Suplemento.');
    }
    // Prevent duplicates
    const alreadyExists = this.#suplementos.some(s => s.id.equals(suplemento.id));
    if (alreadyExists) {
      throw new Error('Este suplemento já faz parte do protocolo.');
    }
    this.#suplementos.push(suplemento);
  }
}
