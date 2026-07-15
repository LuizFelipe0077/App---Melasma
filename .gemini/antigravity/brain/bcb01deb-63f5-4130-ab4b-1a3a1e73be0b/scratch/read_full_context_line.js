import fs from 'fs';
import readline from 'readline';

const file = 'C:\\Users\\Luiz\\.gemini\\antigravity\\brain\\bcb01deb-63f5-4130-ab4b-1a3a1e73be0b\\.system_generated\\logs\\transcript_full.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(file),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('turns out to be SHA-256 of')) {
    console.log('FOUND LINE IN FULL TRANSCRIPT:');
    const idx = line.indexOf('turns out to be SHA-256 of');
    console.log(line.substring(idx - 100, idx + 400));
  }
});
