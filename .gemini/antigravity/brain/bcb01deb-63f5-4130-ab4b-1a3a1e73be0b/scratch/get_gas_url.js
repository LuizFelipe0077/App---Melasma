import fs from 'fs';
import readline from 'readline';

const file = 'C:\\Users\\Luiz\\.gemini\\antigravity\\brain\\bcb01deb-63f5-4130-ab4b-1a3a1e73be0b\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(file),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('macros/s/')) {
    console.log('FOUND GAS URL IN LOGS:');
    const idx = line.indexOf('macros/s/');
    console.log(line.substring(idx - 50, idx + 120));
  }
});
