import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Building Webpack...');
execSync('npx webpack --config webpack.config.cjs --mode production', { stdio: 'inherit' });

console.log('Injecting GAS Entry Points...');
const bundlePath = path.join(__dirname, 'dist', 'bundle.js');
let content = fs.readFileSync(bundlePath, 'utf8');

const entryPoints = `
function doPost(e) { return App.doPost(e); }
function doGet(e) { return App.doGet(e); }
function setup() { return App.setup(); }
`;

content = content + '\n' + entryPoints;
fs.writeFileSync(bundlePath, content, 'utf8');

console.log('Copying appsscript.json to dist...');
fs.copyFileSync(
  path.join(__dirname, 'appsscript.json'),
  path.join(__dirname, 'dist', 'appsscript.json')
);

console.log('Build complete!');
