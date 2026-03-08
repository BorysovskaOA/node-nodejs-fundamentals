import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const findFiles = (dir, ext) => {
  const results = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      results.push(...findFiles(fullPath, ext));
    } else if (item.isFile() && item.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }

  return results;
};

const findByExt = async () => {
  // Write your code here
  // Recursively find all files with specific extension
  // Parse --ext CLI argument (default: .txt)

  const extArg = process.argv.find(arg => arg.startsWith('--ext'))?.split('=')?.[1];
  const ext = extArg ?? '.txt';

  const files = findFiles(process.cwd(), ext);

  if (files.length === 0) {
    console.log(`No files with extention ${ext}`);
  } else {
    files.forEach(file => console.log(file));
  }
};

await findByExt();
