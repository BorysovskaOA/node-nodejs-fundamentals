import process from 'node:process';
import readline from 'node:readline'

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const readlineInstance = readline.createInterface({
    input: process.stdin, 
    output: process.stdout,
  });

  readlineInstance.prompt();

  readlineInstance.on('line', (line) => {
    switch (line.trim()) {
      case 'uptime': {
        console.log(process.uptime());
        readlineInstance.prompt();
        break;
      }
      case 'cwd': {
        console.log(process.cwd());
        readlineInstance.prompt();
        break;
      }
      case 'date': {
        console.log(new  Date);
        readlineInstance.prompt();
        break;
      }
      case 'exit': {
        readlineInstance.close()
        break;
      }
      default: {
        console.log('Unknown command');
        readlineInstance.prompt();
      }
    }
  });

  readlineInstance.on('close', () => {
    console.log('Goodbye!')
    readlineInstance.close()
  });
};

interactive();
