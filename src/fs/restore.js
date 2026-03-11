import fs from 'node:fs/promises';
import path from 'node:path';

const getSnapshotEntries = async (filePath) => {
  try {
    const snapshotFileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    const parsedSnapshot = JSON.parse(snapshotFileContent);

    return parsedSnapshot.entries;
  } catch {
    throw new Error(`FS operation failed: Snapshot ${filePath} does't exit`);
  }
}

const restore = async () => {
  // Write your code here
  // Read snapshot.json
  // Treat snapshot.rootPath as metadata only
  // Recreate directory/file structure in workspace_restored

  const snapshotPath = path.resolve(process.cwd(), 'workspace/snapshot.json');
  const snapshotEntries = await getSnapshotEntries(snapshotPath);
  const targetRoot = path.join(process.cwd(), 'workspace_restored');


  try {
    await fs.mkdir(targetRoot);
  } catch (err) {
    throw new Error(`FS operation failed: ${targetRoot} already exist`);
  }

  const tasks = snapshotEntries.map(async entry => {
    const fullPath = path.join(targetRoot, entry.path);

    if (entry.type === 'directory') {
      return fs.mkdir(fullPath, { recursive: true });
    } else {
      const parentDir = path.dirname(fullPath);
      await fs.mkdir(parentDir, { recursive: true });

      return fs.writeFile(fullPath, entry.content, { encoding: 'base64' });
    }
  });

  await Promise.all(tasks);

  console.log('Restoration complete!');
};

await restore();
