import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getArg } from '../utils/getArg.js';

const findFiles = async (dir, ext) => {
  try {
    const items = await fs.readdir(dir, { withFileTypes: true, recursive: true });

    const results = [];

    items.forEach((item) => {
      const fullPath = path.join(item.parentPath, item.name);
      const relativePath = path.relative(dir, fullPath);

      if (item.isFile() && item.name.endsWith(ext)) {
        results.push(relativePath);
      }
    })

    return results.sort((a, b) => a.localeCompare(b));
  } catch {
    throw new Error('FS operation failed')
  }
};

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  const ext = getArg('ext') ?? '.txt';
  const workspaceDir = path.join(process.cwd(), 'workspace');
  const files = await findFiles(workspaceDir, ext);
  
  if (files.length === 0) {
    console.log(`No files with extention ${ext}`);
  } else {
    files.forEach(file => console.log(file));
  }
};

await findByExt();
