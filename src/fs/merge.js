import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const merge = async () => {
  // Write your code here
  // Default: read all .txt files from workspace/parts in alphabetical order
  // Optional: support --files filename1,filename2,... to merge specific files in provided order
  // Concatenate content and write to workspace/merged.txt

  const partsDir = path.join(process.cwd(), 'workspace/parts');
  const filesArg = process.argv.find(arg => arg.startsWith('--files='))?.split('=')[1];
  let filesToProcess = [];

  if (filesArg) {
    const fileNames = filesArg.split(',');
    filesToProcess = fileNames.map(name => path.join(partsDir, name.trim()));
  } else {
    if (!fs.existsSync(partsDir)) {
      console.error('Directory parts not found');
      process.exit(1);
    }

    filesToProcess = fs.readdirSync(partsDir)
      .filter(file => file.endsWith('.txt'))
      .sort()
      .map(file => path.join(partsDir, file));
  }

  const content = filesToProcess
    .filter(filePath => fs.existsSync(filePath))
    .map(filePath => fs.readFileSync(filePath, 'utf-8'))
    .join('\n'); 
  
  try {
    const outputFile = path.join(process.cwd(), 'workspace/merged.txt');

    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, content);
    console.log(`Completed`);
  } catch (error) {
    console.error('Failed to write merged file:', error.message);
  }
};

await merge();
