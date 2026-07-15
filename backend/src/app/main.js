import { handlePost } from '../infrastructure/controllers/GasController.js';
import { DatabaseSetup } from '../infrastructure/persistence/DatabaseSetup.js';

export function doPost(e) {
  return handlePost(e);
}

export function doGet(e) {
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
