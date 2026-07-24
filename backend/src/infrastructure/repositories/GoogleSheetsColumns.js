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
    DATA_FIM: 8,
    OBSERVACOES: 9,
    PROTOCOLO_NOME: 10
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
    STATUS: 5,
    RETROATIVO: 6
  },
  PROTOCOLO: {
    ID: 0,
    NOME: 1,
    DURACAO_DIAS: 2
  },
  // Aba separada 'Suplementos', não a Protocolos — GoogleSheetsProtocoloRepository
  // hoje usa índices literais em vez desta constante; mantida como referência.
  SUPLEMENTO: {
    ID: 0,
    PROTOCOLO_ID: 1,
    NOME: 2,
    DOSAGEM: 3,
    HORARIOS: 4, // Array serializado (JSON)
    INSTRUCOES: 5,
    QUANTIDADE: 6,
    DIAS_SEMANA: 7, // Array serializado (JSON)
    DATA_INICIO: 8,
    DATA_FIM: 9,
    TIPO: 10,
    NOTIFICACAO: 11,
    DATAS_ESPECIFICAS: 12 // Array serializado (JSON) — datas exatas, sobrepõe DIAS_SEMANA quando não-vazio
  },
  LIBERACAO: {
    ID: 0,
    PACIENTE_ID: 1,
    DATA_LIBERADA: 2,
    CONCEDIDA_EM: 3,
    EXPIRA_EM: 4,
    OPERADOR_ID: 5,
    MOTIVO: 6,
    STATUS: 7,
    UTILIZADA_EM: 8
  }
};
