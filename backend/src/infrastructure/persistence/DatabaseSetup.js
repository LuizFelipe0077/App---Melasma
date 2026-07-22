import { SystemConfiguration } from '../../shared/config/SystemConfiguration.js';

/**
 * DatabaseSetup.js
 * Infrastructure utility to automatically initialize and configure 
 * all required Google Sheets tabs and headers on the target Spreadsheet.
 */
export class DatabaseSetup {
  /**
   * Automatically initializes the database sheets tabs and write headers.
   * Safe to call repeatedly (idempotent).
   */
  static initializeDatabase() {
    if (typeof SpreadsheetApp === 'undefined') {
      if (typeof console !== 'undefined') {
        console.log('Ambiente local/teste: inicialização física do Google Sheets ignorada.');
      }
      return;
    }

    const ssId = SystemConfiguration.DATABASE_SPREADSHEET_ID;
    if (!ssId || ssId === 'SANDBOX_SPREADSHEET_ID_DEFAULT') {
      throw new Error('DATABASE_SPREADSHEET_ID não está configurado nas propriedades do script.');
    }

    const ss = SpreadsheetApp.openById(ssId);
    
    // Define all required sheets and their corresponding headers
    const schema = {
      'Pacientes': [
        'id', 'protocoloId', 'nome', 'email', 'telefone', 
        'senhaHash', 'status', 'dataInicio', 'dataFim', 'observacoes', 'protocoloNome'
      ],
      'Protocolos': [
        'id', 'nome', 'duracaoDias'
      ],
      'Suplementos': [
        'id', 'protocoloId', 'nome', 'dosagem', 'horarios', 'instrucoes'
      ],
      'Check_Ins': [
        'id', 'pacienteId', 'suplementoId', 'dtPrescrita', 
        'dtRealizada', 'status', 'retroativo'
      ],
      'PermissoesRetroativas': [
        'id', 'pacienteId', 'horasLiberadas', 'motivo', 
        'operadorId', 'expiraEm', 'status', 'createdAt'
      ],
      'Gamificacao': [
        'id', 'pacienteId', 'xpTotal', 'streakAtual', 'maiorStreak', 'conquistas'
      ],
      'Observacoes': [
        'id', 'pacienteId', 'operadorId', 'texto', 'tipo', 'createdAt'
      ],
      'Auditoria': [
        'id', 'timestamp', 'operadorId', 'tabela', 'registroId', 
        'tipoAcao', 'dadosAntigos', 'dadosNovos', 'ip', 'dispositivo', 'motivo'
      ]
    };

    for (const [tabName, headers] of Object.entries(schema)) {
      let sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        sheet = ss.insertSheet(tabName);
        if (typeof console !== 'undefined') {
          console.log(`Criando aba física: [${tabName}]`);
        }
      }

      // Check if header needs to be written
      const lastRow = sheet.getLastRow();
      if (lastRow === 0) {
        // Write header row
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        // Format header row (bold & slate background styling for premium spreadsheet appearance)
        sheet.getRange(1, 1, 1, headers.length)
          .setFontWeight('bold')
          .setBackground('#1E293B')
          .setFontColor('#FFFFFF');
        
        // Auto-fit columns layout
        sheet.autoResizeColumns(1, headers.length);
      }
    }
    
    SpreadsheetApp.flush();
    if (typeof console !== 'undefined') {
      console.log('Inicialização do banco de dados concluída com sucesso!');
    }
  }
}
