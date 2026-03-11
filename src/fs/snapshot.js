import fs from 'node:fs/promises';
import path from 'node:path';

const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    const content = await fs.readFile(filePath, { encoding: 'base64' });
    return {
      path: filePath,
      type: 'file',
      size: stats.size,
      content,
    }
  } catch (err) {
    console.log(err);
    throw new Error(`Couldn't get file data of ${filePath}`);
  }
}

const scan = async (directoryPath) => {
  try {
    const items = await fs.readdir(directoryPath, { withFileTypes: true, recursive: true });

    const tasks = items.map((item) => {
      const fullPath = path.join(item.parentPath, item.name);    

      if (item.isDirectory()) {
        return [
          {
            path: fullPath,
            type: 'directory',
          }, 
        ];
      }

      return getFileStats(fullPath);
    })

    const resuts = (await Promise.all(tasks)).flat();

    return resuts.sort((a, b) => a.path.localeCompare(b.path));
  } catch (err) {
    console.log(err);
    throw new Error('FS operation failed')
  }
}

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata

  const rootPath = path.resolve(process.cwd(), 'workspace');
  const entries = await scan(rootPath);

  const entriesWithRelativePath = entries.map((item) => {
    const relativePath = path.relative(rootPath, item.path);

    return {
      ...item,
      path: relativePath,
    }
  })

  const snapshot = {
    rootPath,
    entries: entriesWithRelativePath,
  };

  await fs.writeFile('workspace/snapshot.json', JSON.stringify(snapshot, null, 2), 'utf8');
  console.log('Snapshot created!');
};

await snapshot();
