import process from 'node:process';
import { spawn } from 'node:child_process';

const execCommand = () => {
  // Write your code here
  // Take command from CLI argument
  // Spawn child process
  // Pipe child stdout/stderr to parent stdout/stderr
  // Pass environment variables
  // Exit with same code as child

  const [,, command, ...commandArgs] = process.argv;
  console.log(command, commandArgs)

  if (!command) {
    console.log('Please enter command');
    process.exit(1)
  }

  const spawnedProcess = spawn(command, commandArgs, {
    env: process.env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  // Can be done automatically with 'inherit' in stdio, but I added it here to try manual piping 
  spawnedProcess.stdout.pipe(process.stdout);
  spawnedProcess.stderr.pipe(process.stderr);


  spawnedProcess.on('exit', (code) => {
    console.log(`Spawned process exited with code: ${code ?? 1}`);
    process.exit(code ?? 1);
  })

  spawnedProcess.on('error', (error) => {
    console.log(`Error in spawned process:`);
    console.error(error);
    process.exit(1);
  })
};

execCommand();
