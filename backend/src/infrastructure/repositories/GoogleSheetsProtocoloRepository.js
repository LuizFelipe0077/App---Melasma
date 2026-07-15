import { GoogleSheetsRepository } from './GoogleSheetsRepository.js';
import { ProtocoloRepositoryInterface } from '../../application/repositories/ProtocoloRepositoryInterface.js';
import { Protocolo } from '../../domain/entities/Protocolo.js';
import { Suplemento } from '../../domain/entities/Suplemento.js';
import { UUID } from '../../domain/valueObjects/UUID.js';

function safeParseDate(val) {
  if (val instanceof Date) return val;
  if (!val) return new Date();
  const str = String(val).trim();
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    return new Date(parseInt(match[3], 10), parseInt(match[2], 10) - 1, parseInt(match[1], 10));
  }
  return new Date(val);
}

function formatDatePtBr(d) {
  if (!(d instanceof Date)) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export class GoogleSheetsProtocoloRepository extends GoogleSheetsRepository {
  #suplementosSheet;

  constructor() {
    super('Protocolos');
    this.#suplementosSheet = new GoogleSheetsRepository('Suplementos');
  }

  #mapRowToSuplemento(r) {
    let horariosArray = [];
    try {
      horariosArray = typeof r[4] === 'string' ? JSON.parse(r[4]) : r[4];
    } catch (e) {
      horariosArray = [];
    }

    let diasSemanaArray = [];
    try {
      diasSemanaArray = typeof r[7] === 'string' ? JSON.parse(r[7]) : r[7];
    } catch (e) {
      diasSemanaArray = ['todos'];
    }

    return new Suplemento({
      id: new UUID(r[0]),
      protocoloId: new UUID(r[1]),
      nome: r[2],
      dosagem: r[3],
      horarios: horariosArray,
      instrucoes: r[5],
      quantidade: r[6] !== undefined ? Number(r[6]) : 1,
      diasSemana: diasSemanaArray || ['todos'],
      dataInicio: r[8] ? safeParseDate(r[8]) : new Date(),
      dataFim: r[9] ? safeParseDate(r[9]) : new Date(),
      tipo: r[10] || 'Outro',
      notificacao: r[11] || 'no_horario'
    });
  }

  findById(id) {
    const pRows = this.readAllRows();
    const pRow = pRows.find(r => r[0] === id);
    if (!pRow) return null;

    // Load linked supplements
    const sRows = this.#suplementosSheet.readAllRows();
    const supMatches = sRows.filter(r => r[1] === id);

    const suplementos = supMatches.map(r => this.#mapRowToSuplemento(r));

    return new Protocolo({
      id: new UUID(pRow[0]),
      nome: pRow[1],
      suplementos,
      duracaoDias: Number(pRow[2])
    });
  }

  findSuplementoById(suplementoId) {
    const sRows = this.#suplementosSheet.readAllRows();
    const r = sRows.find(row => row[0] === suplementoId);
    if (!r) return null;

    return this.#mapRowToSuplemento(r);
  }

  save(protocolo) {
    // 1. Save Protocol info
    const pRow = [
      protocolo.id.value,
      protocolo.nome,
      protocolo.duracaoDias
    ];
    this.writeRow(pRow, protocolo.id.value, 0);

    // 2. Save each supplement
    for (const suplemento of protocolo.suplementos) {
      const sRow = [
        suplemento.id.value,
        suplemento.protocoloId.value,
        suplemento.nome,
        suplemento.dosagem,
        JSON.stringify(suplemento.horarios),
        suplemento.instrucoes,
        suplemento.quantidade,
        JSON.stringify(suplemento.diasSemana),
        formatDatePtBr(suplemento.dataInicio),
        formatDatePtBr(suplemento.dataFim),
        suplemento.tipo,
        suplemento.notificacao
      ];
      this.#suplementosSheet.writeRow(sRow, suplemento.id.value, 0);
    }
  }

  findSuplementosByProtocoloId(protocoloId) {
    const p = this.findById(protocoloId);
    return p ? p.suplementos : [];
  }
}
