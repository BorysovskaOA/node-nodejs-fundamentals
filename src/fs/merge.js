import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getArg } from '../utils/getArg.js';

const getValidArgFilePaths = async (filesArg, dirPath) => {
  const fileNames = filesArg.split(',');
    const filePaths = fileNames.map(name => path.join(dirPath, name.trim()));

    try {
      await Promise.all(filePaths.map((filePath) => fs.access(filePath, fs.constants.F_OK)));
    } catch {
      throw new Error(`FS operation failed: No file from arguments`)
    }

    return filePaths;
}

const getDefaultFilePaths = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    const filePaths = files.filter(file => file.isFile() && file.name.endsWith('.txt'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(file => path.join(dirPath, file.name));

      if (files.length === 0) {
        throw new Error(`FS operation failed: No files in folder ${dirPath}`)
      }

      return filePaths;
  } catch {
    throw new Error(`FS operation failed: No folder ${dirPath}`)
  }
}

const getFilesToMerge = (dirPath) => {
  const filesArg = getArg('files');

  if (filesArg) {
    return getValidArgFilePaths(filesArg, dirPath);
  } else {
    return getDefaultFilePaths(dirPath)
  }
}

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const partsDir = path.join(process.cwd(), 'workspace/parts');
  const filesToMerge = await getFilesToMerge(partsDir);

  const fileContents = await Promise.all(filesToMerge.map((filePath) => {
    return fs.readFile(filePath, { encoding: 'utf-8'});
  }));
  
  try {
    const outputFile = path.join(process.cwd(), 'workspace/merged.txt');
    const outputDir = path.dirname(outputFile);

    await fs.mkdir(outputDir, { recursive: true });

    await fs.writeFile(outputFile, fileContents.join('\n'));
    console.log(`Completed`);
  } catch {
    console.error('FS operation failed: Failed to write merged file');
  }
};

await merge();
