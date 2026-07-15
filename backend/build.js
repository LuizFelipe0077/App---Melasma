const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building Webpack...');
execSync('npx webpack --mode production', { stdio: 'inherit' });

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

console.log('Build complete!');
