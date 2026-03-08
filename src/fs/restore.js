import fs from 'node:fs';
import path from 'node:path';

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored

  const snapshotPath = path.resolve(process.cwd(), 'workspace/snapshot.json');
  const data = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const targetRoot = path.join(process.cwd(), 'workspace_restored');

  if (!fs.existsSync(targetRoot)) {
    fs.mkdirSync(targetRoot, { recursive: true });
  }

  for (const entry of data.entries) {
    const fullPath = path.join(targetRoot, entry.path);

    if (entry.type === 'directory') {
      fs.mkdirSync(fullPath, { recursive: true });
    } else {
      const parentDir = path.dirname(fullPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      fs.writeFileSync(fullPath, '', 'utf8');
    }
  }

  console.log('Restoration complete!');
};

await restore();
