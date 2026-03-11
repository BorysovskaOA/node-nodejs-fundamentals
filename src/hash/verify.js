import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import process from 'node:process';

const verify = async () => {
  // Write your code here
  // Read checksums.json
  // Calculate SHA256 hash using Streams API
  // Print result: filename — OK/FAIL

  const workspaceDir = path.join(process.cwd(), 'workspace');
  const checksumsFile = path.join(workspaceDir, 'checksums.json');

  if (!fs.existsSync(checksumsFile)) {
    throw new Error('FS operation failed');
  };

  const data = await readFile(checksumsFile, 'utf-8');
  const checksums = JSON.parse(data);

  for (const [filename, expectedHash] of Object.entries(checksums)) {
    const filePath = path.join(workspaceDir, filename);

    if (!fs.existsSync(filePath)) {
      console.log(`${filename} — FAIL`);
      continue;
    }

    const hash = createHash('sha256');
    const fileStream = fs.createReadStream(filePath);

    await pipeline(fileStream, hash);

    const actualHash = hash.digest('hex');

    const status = actualHash === expectedHash ? 'OK' : 'FAIL';
    console.log(`${filename} — ${status}`);
  }

  console.log('Completed');
};

await verify();
