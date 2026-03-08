import { Transform } from 'node:stream';
import process from 'node:process';

const lineNumberer = () => {
  // Write your code here
  // Read from process.stdin
  // Use Transform Stream to prepend line numbers
  // Write to process.stdout

  let count = 1;

  const numberTransform = new Transform({
    transform(chunk, _, callback) {
      const content = chunk.toString();
      const lines = content.split(/\r?\n/);

      const numberedLines = lines
        .filter(line => line.length > 0)
        .map(line => `${count++} ${line}`)
        .join('\n');

      if (numberedLines) {
        this.push(numberedLines + '\n');
      }
      
      callback();
    }
  });

  process.stdin
    .pipe(numberTransform)
    .pipe(process.stdout);
};

lineNumberer();
