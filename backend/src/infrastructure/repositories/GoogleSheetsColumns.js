/**
 * GoogleSheetsColumns.js
 * 
 * Centraliza os índices de colunas de todas as abas (Sheets) do banco de dados Google Sheets.
 * Resolve o problema de "Magic Numbers" nos repositórios e mappers.
 * 
 * Se a estrutura da planilha mudar, basta alterar este mapeamento.
 */
export const SheetColumns = {
  PACIENTE: {
    ID: 0,
    PROTOCOLO_ID: 1,
    NOME: 2,
    EMAIL: 3,
    TELEFONE: 4,
    SENHA_HASH: 5,
    STATUS: 6,
    DATA_INICIO: 7,
    DATA_FIM: 8
  },
  GAMIFICACAO: {
    ID: 0,
    PACIENTE_ID: 1,
    XP_TOTAL: 2,
    STREAK_ATUAL: 3,
    MAIOR_STREAK: 4,
    CONQUISTAS: 5
  },
  CHECKIN: {
    ID: 0,
    PACIENTE_ID: 1,
    SUPLEMENTO_ID: 2,
    DATA_HORA_PRESCRITA: 3,
    DATA_HORA_REALIZADA: 4,
    STATUS: 5
  },
  PROTOCOLO: {
    ID: 0,
    NOME: 1,
    SUPLEMENTOS: 2 // Array serializado
  },
  PERMISSAO: {
    PACIENTE_ID: 0,
    OPERADOR_ID: 1,
    HORAS_LIBERADAS: 2,
    DATA_HORA_CONCESSAO: 3,
    MOTIVO: 4
  }
};
