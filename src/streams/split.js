import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import process from 'node:process';
import { getArg } from '../utils/getArg.js';

const split = async () => {
  // Write your code here
  // Read source.txt using Readable Stream
  // Split into chunk_1.txt, chunk_2.txt, etc.
  // Each chunk max N lines (--lines CLI argument, default: 10)

  const sourceFile = path.join(process.cwd(), 'workspace/source.txt');
  const outputDir = path.join(process.cwd(), 'workspace');

  const linesArg = getArg('lines');
  const maxLines = linesArg && !Number.isNaN(linesArg) ? Number(linesArg): 10;

  if (!fs.existsSync(sourceFile)) {
    throw new Error('No source file');
  };

  const rl = readline.createInterface({
    input: fs.createReadStream(sourceFile),
    crlfDelay: Infinity
  });

  let currentLineCount = 0;
  let chunkIndex = 1;
  let writeStream = null;

  rl.on('line', (line) => {
    if (currentLineCount % maxLines === 0) {
      if (writeStream) writeStream.end();
      writeStream = fs.createWriteStream(path.join(outputDir, `chunk_${chunkIndex++}.txt`));
    }

    writeStream.write(line + '\n');
    currentLineCount++;
  });

  if (writeStream) writeStream.end();

  console.log('Completed');
};

await split();
