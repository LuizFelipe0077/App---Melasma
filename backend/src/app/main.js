import { handlePost } from '../infrastructure/controllers/GasController.js';
import { DatabaseSetup } from '../infrastructure/persistence/DatabaseSetup.js';

function healProperties() {
  if (typeof PropertiesService !== 'undefined') {
    const props = PropertiesService.getScriptProperties();
    const currentId = props.getProperty('DATABASE_SPREADSHEET_ID');
    if (!currentId || currentId.trim() === '' || currentId === 'SANDBOX_SPREADSHEET_ID_DEFAULT') {
      props.setProperty('ADMIN_EMAIL', 'nicalves1305@gmail.com');
      props.setProperty('ADMIN_PASS_HASH', 'a95b69434f868fcfb1246ab567108fe09efe4a1eff6c4eb49f705a20da169392');
      props.setProperty('JWT_SECRET', 'CHAVE_FORTE_EX_HASH_ALEATORIO');
      props.setProperty('DATABASE_SPREADSHEET_ID', '1jIjZMggKBfiRzHxUi6jzg4WEWukc9XwfGTH9WPcuBsM');
      props.setProperty('ENV', 'production');
    }
  }
}

export function doPost(e) {
  healProperties();
  return handlePost(e);
}

export function doGet(e) {
  healProperties();
  const status = {
    app: 'Acompanhamento Clínico Integrativo API',
    status: 'ONLINE',
    timestamp: new Date().toISOString(),
    environment: typeof PropertiesService !== 'undefined' ? 'Google Apps Script' : 'Node Sandbox'
  };

  if (typeof ContentService !== 'undefined') {
    return ContentService.createTextOutput(JSON.stringify(status))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return JSON.stringify(status);
}

export function setup() {
  DatabaseSetup.initializeDatabase();
}
