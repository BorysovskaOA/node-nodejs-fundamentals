import { mkdir, writeFile, access } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { pipeline } from 'node:stream/promises';
import { createBrotliDecompress } from 'node:zlib';

const HEADER_SIZE = 12;

const decompressDir = async () => {
  // Write your code here
  // Read archive.br from workspace/compressed/
  // Decompress and extract to workspace/decompressed/
  // Use Streams API

  const archive = path.join(process.cwd(), 'workspace/compressed/archive.br');
  const targetDir = path.join(process.cwd(), 'workspace/decompressed');

  try {
    await access(archive);
  } catch (error) {
    console.log(error);
    throw new Error(`FS operation failed: No file ${archive}`);
  }
  
  try {
    await pipeline(
      createReadStream(archive),
      createBrotliDecompress(),
      async function* (source) {
        let buffer = Buffer.alloc(0);

        for await (const chunk of source) {
          buffer = Buffer.concat([buffer, chunk]);

          while (buffer.length >= HEADER_SIZE) {
            const pathLen = buffer.readUInt32BE(0);
            const contentLen = Number(buffer.readBigUInt64BE(4));
            const totalEntrySize = HEADER_SIZE + pathLen + contentLen;

            if (buffer.length < totalEntrySize) break;

            const relPath = buffer.subarray(HEADER_SIZE, HEADER_SIZE + pathLen).toString();
            const content = buffer.subarray(HEADER_SIZE + pathLen, totalEntrySize);
            const fullPath = path.join(targetDir, relPath);

            await mkdir(path.dirname(fullPath), { recursive: true });
            await writeFile(fullPath, content);

            buffer = buffer.subarray(totalEntrySize);
          }
          yield chunk;
        }
      }
    );
    console.log('Decompressed');
  } catch (err) {
    console.error('Decompression failed:', err.message);
  }
};

await decompressDir();
