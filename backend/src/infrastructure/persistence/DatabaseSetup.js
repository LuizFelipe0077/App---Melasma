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
    // Rótulos em português — são só o texto da linha 1, nunca lidos de volta
    // pelo código (leitura sempre por índice numérico via GoogleSheetsColumns.js).
    const schema = {
      'Pacientes': [
        'ID', 'ID do Protocolo', 'Nome', 'E-mail', 'Telefone',
        'Hash da Senha', 'Status', 'Data de Início', 'Data de Término', 'Observações', 'Nome do Protocolo'
      ],
      'Protocolos': [
        'ID', 'Nome', 'Duração (dias)'
      ],
      'Suplementos': [
        'ID', 'ID do Protocolo', 'Nome', 'Dosagem', 'Horários', 'Instruções'
      ],
      'Check_Ins': [
        'ID', 'ID do Paciente', 'ID do Suplemento', 'Data/Hora Prevista',
        'Data/Hora Realizada', 'Status', 'Retroativo'
      ],
      'PermissoesRetroativas': [
        'ID', 'ID do Paciente', 'Horas Liberadas', 'Motivo',
        'ID do Operador', 'Expira Em', 'Status', 'Criado Em'
      ],
      'Gamificacao': [
        'ID', 'ID do Paciente', 'XP Total', 'Sequência Atual', 'Maior Sequência', 'Conquistas'
      ],
      'Observacoes': [
        'ID', 'ID do Paciente', 'ID do Operador', 'Texto', 'Tipo', 'Criado Em'
      ],
      'Auditoria': [
        'ID', 'Data/Hora', 'ID do Operador', 'Tabela', 'ID do Registro',
        'Tipo de Ação', 'Dados Antigos', 'Dados Novos', 'IP', 'Dispositivo', 'Motivo'
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
