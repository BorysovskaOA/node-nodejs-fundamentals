import process from 'node:process';
import readline from 'node:readline'

const interactive = () => {
  // Write your code here
  // Use readline module for interactive CLI
  // Support commands: uptime, cwd, date, exit
  // Handle Ctrl+C and unknown commands

  const readlineInstance = readline.createInterface({input: process.stdin, output: process.stdout });

  readlineInstance.prompt();

  readlineInstance.on('SIGINT', () => {
    console.log('Pressed Ctrl+C');

    const confirmQuestion = () => readlineInstance.question('Are you sure that you want to end session?(yes/y/no/n)', (answer) => {
      switch (answer.toLocaleLowerCase().trim()) {
        case 'yes':
        case 'y': {
          console.log('Ok. Goodbye')
          readlineInstance.close()
          break;
        }
        case 'no':
        case 'n': {
          console.log('Ok. Please continue');
          readlineInstance.prompt();
          break;
        }
        default:
          console.log('Unknown command. Please anwser the question:');
          confirmQuestion();
      }
    });
    
    confirmQuestion();
  });

  readlineInstance.on('line', (line) => {
    switch (line.trim()) {
      case 'uptime': {
        console.log(process.uptime());
        break;
      }
      case 'cwd': {
        console.log(process.cwd());
        break;
      }
      case 'date': {
        console.log(new  Date);
        break;
      }
      case 'exit': {
        readlineInstance.close()
        break;
      }
      default: {
        console.log('Unknown command');
      }
    }
    readlineInstance.prompt();
  });
};

interactive();
