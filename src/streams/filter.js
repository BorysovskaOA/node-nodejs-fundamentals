import { Transform } from 'node:stream';
import process from 'node:process';
import { getArg } from '../utils/getArg.js';

const filter = () => {
  // Write your code here
  // Read from process.stdin
  // Filter lines by --pattern CLI argument
  // Use Transform Stream
  // Write to process.stdout

  const pattern = getArg('pattern', true);

  const filterTransform = new Transform({
    transform(chunk, _, callback) {
      const content = chunk.toString();
      const filtered = content
        .split(/\r?\n/)
        .filter(line => line.includes(pattern))
        .join('\n');

      if (filtered) {
        this.push(filtered + '\n');
      }
      callback();
    }
  });

  process.stdin
    .pipe(filterTransform)
    .pipe(process.stdout);

  process.stdin.on('error', (err) => console.error(err));
  filterTransform.on('error', (err) => console.error(err));
};

filter();
