import { readFile, mkdir, readdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { createBrotliCompress } from 'node:zlib';

const HEADER_SIZE = 12;

const getFiles = async (dir) => {
  try {
    const entries = await readdir(dir, { withFileTypes: true, recursive: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const res = path.join(dir, entry.name);
      return entry.isDirectory() ? [] : res;
    }));
    return files.flat();
  } catch {
    throw new Error(`FS operation failed: ${dir} is not a directory`);
  }
};

const compressDir = async () => {
  // Write your code here
  // Read all files from workspace/toCompress/
  // Compress entire directory structure into archive.br
  // Save to workspace/compressed/
  // Use Streams API

  const sourceDir = path.join(process.cwd(), 'workspace/toCompress');
  const targetDir = path.join(process.cwd(), 'workspace/compressed');
  const outputFile = path.join(targetDir, 'archive.br');

  await mkdir(targetDir, { recursive: true });

  const allFiles = await getFiles(sourceDir);

  const sourceStream = Readable.from((async function* () {
    for (const filePath of allFiles) {
      const relativePath = path.relative(sourceDir, filePath);
      
      const content = await readFile(filePath);
      
      const pathBuf = Buffer.from(relativePath);
      const header = Buffer.alloc(HEADER_SIZE);
      header.writeUInt32BE(pathBuf.length, 0);
      header.writeBigUInt64BE(BigInt(content.length), 4);
      
      yield header;
      yield pathBuf;
      yield content;
    }
  })());

  await pipeline(
    sourceStream, 
    createBrotliCompress(), 
    createWriteStream(outputFile)
  );

  console.log('Compressed');
};

await compressDir();
