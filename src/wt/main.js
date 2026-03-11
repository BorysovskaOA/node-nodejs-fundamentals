import path from 'node:path';
import fs from 'node:fs/promises'
import process from 'node:process';
import os from 'node:os';
import { Worker } from 'node:worker_threads';

const getData = async(dataPath) => {
  try {
    const dataFileContent = await fs.readFile(dataPath, { encoding: 'utf8' });
    return JSON.parse(dataFileContent);
  } catch (err) {
    console.log(err);
    throw new Error(`FS operation failed: Data ${dataPath} does't exit`);
  }
}

const getDataChunks = (data) => {
  const numCPUs = os.cpus().length;
  const chunkSize = Math.ceil(data.length / numCPUs);

  return Array.from({ length: numCPUs }, (_, i) => {
    const start = i * chunkSize;
    return data.slice(start, start + chunkSize);
  });
}

const runWorker = (data) => {
  const workerPath = new URL('./worker.js', import.meta.url);

  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath);
    worker.on('message', (data) => {
      resolve(data);
      worker.terminate();
    });
    worker.on('error', (error) => {
      reject(error);
      worker.terminate();
    });
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });

    worker.postMessage(data);
  });
}

const kWaySortMerge = (chunks) => {
  const result = [];

  const indexes = Array.from({length: chunks.length}, () => 0);
  const amountOfAllIndexes = chunks.reduce((acc, c)=> acc + c.length, 0);

  for (let resultIndexToFind = 0; resultIndexToFind < amountOfAllIndexes; resultIndexToFind++) {
    let minValue = Infinity;
    let minValueChunkIndex = -1;

    for (let chunkIndex = 0; chunkIndex < indexes.length; chunkIndex++) {
      if (chunks[chunkIndex][indexes[chunkIndex]] < minValue) {
        minValue = chunks[chunkIndex][indexes[chunkIndex]];
        minValueChunkIndex = chunkIndex;
      }
    }
    
    result.push(minValue);
    indexes[minValueChunkIndex]++;
  }

  return result;
}

const main = async () => {
  // Write your code here
  // Read data.json containing array of numbers
  // Split into N chunks (N = CPU cores)
  // Create N workers, send one chunk to each
  // Collect sorted chunks
  // Merge using k-way merge algorithm
  // Log final sorted array

  const dataPath = path.resolve(process.cwd(), 'data.json');

  const data = await getData(dataPath);
  const dataChunks = getDataChunks(data);

  const sortedChunks = await Promise.all(dataChunks.map(runWorker));
  const sortedResult = kWaySortMerge(sortedChunks);

  console.log(sortedResult);
};

await main();
