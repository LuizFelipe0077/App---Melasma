import { handlePost } from '../infrastructure/controllers/GasController.js';
import { DatabaseSetup } from '../infrastructure/persistence/DatabaseSetup.js';

/**
 * doPost(e)
 * Global entrypoint for Google Apps Script WebApp POST requests.
 */
global.doPost = function(e) {
  return handlePost(e);
};

/**
 * doGet(e)
 * Global entrypoint for Google Apps Script WebApp GET requests.
 * Used for status checking and health check verification.
 */
global.doGet = function(e) {
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
};

/**
 * setup()
 * Manual trigger function to initialize the spreadsheet database structure.
 * Clinical administrators run this function once from the GAS Editor after deployment.
 */
global.setup = function() {
  DatabaseSetup.initializeDatabase();
};
