import fs from 'node:fs';
import path from 'node:path';

const snapshot = async () => {
  // Write your code here
  // Recursively scan workspace directory
  // Write snapshot.json with:
  // - rootPath: absolute path to workspace
  // - entries: flat array of relative paths and metadata

  const rootPath = path.resolve(process.cwd(), 'workspace');
  const entries = [];

  function scan(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      const stats = fs.statSync(fullPath);
      
      const relativePath = path.relative(rootPath, fullPath);

      entries.push({
        path: relativePath,
        type: item.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        createdAt: stats.birthtime 
      });

      if (item.isDirectory()) {
        scan(fullPath);
      }
    }
  }

  scan(rootPath);

  const snapshot = {
    rootPath,
    entries
  };

  fs.writeFileSync('workspace/snapshot.json', JSON.stringify(snapshot, null, 2), 'utf8');
  console.log('Snapshot created!');
};

await snapshot();
