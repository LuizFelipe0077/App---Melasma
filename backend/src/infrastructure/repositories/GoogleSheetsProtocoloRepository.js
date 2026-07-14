import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { ProtocoloRepositoryInterface } from '../../application/repositories/ProtocoloRepositoryInterface.js';
import { Protocolo } from '../../domain/entities/Protocolo.js';
import { Suplemento } from '../../domain/entities/Suplemento.js';
import { UUID } from '../../domain/valueObjects/UUID.js';

export class GoogleSheetsProtocoloRepository extends GoogleSheetsRepository {
  #suplementosSheet;

  constructor() {
    super('Protocolos');
    this.#suplementosSheet = new GoogleSheetsRepository('Suplementos');
  }

  async findById(id) {
    const pRows = await this.readAllRows();
    const pRow = pRows.find(r => r[0] === id);
    if (!pRow) return null;

    // Load linked supplements
    const sRows = await this.#suplementosSheet.readAllRows();
    const supMatches = sRows.filter(r => r[1] === id);

    const suplementos = supMatches.map(r => {
      let horariosArray = [];
      try {
        horariosArray = typeof r[4] === 'string' ? JSON.parse(r[4]) : r[4];
      } catch (e) {
        horariosArray = [];
      }

      return new Suplemento({
        id: new UUID(r[0]),
        protocoloId: new UUID(r[1]),
        nome: r[2],
        dosagem: r[3],
        horarios: horariosArray,
        instrucoes: r[5]
      });
    });

    return new Protocolo({
      id: new UUID(pRow[0]),
      nome: pRow[1],
      suplementos,
      duracaoDias: Number(pRow[2])
    });
  }

  async findSuplementoById(suplementoId) {
    const sRows = await this.#suplementosSheet.readAllRows();
    const r = sRows.find(row => row[0] === suplementoId);
    if (!r) return null;

    let horariosArray = [];
    try {
      horariosArray = typeof r[4] === 'string' ? JSON.parse(r[4]) : r[4];
    } catch (e) {
      horariosArray = [];
    }

    return new Suplemento({
      id: new UUID(r[0]),
      protocoloId: new UUID(r[1]),
      nome: r[2],
      dosagem: r[3],
      horarios: horariosArray,
      instrucoes: r[5]
    });
  }

  async save(protocolo) {
    // 1. Save Protocol info
    const pRow = [
      protocolo.id.value,
      protocolo.nome,
      protocolo.duracaoDias
    ];
    await this.writeRow(pRow, protocolo.id.value, 0);

    // 2. Save each supplement
    for (const suplemento of protocolo.suplementos) {
      const sRow = [
        suplemento.id.value,
        suplemento.protocoloId.value,
        suplemento.nome,
        suplemento.dosagem,
        JSON.stringify(suplemento.horarios),
        suplemento.instrucoes
      ];
      await this.#suplementosSheet.writeRow(sRow, suplemento.id.value, 0);
    }
  }

  async findSuplementosByProtocoloId(protocoloId) {
    const p = await this.findById(protocoloId);
    return p ? p.suplementos : [];
  }
}
