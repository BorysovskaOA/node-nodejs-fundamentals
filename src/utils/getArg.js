export const getArg = (argName, required = false) => {
  const argIndex = process.argv.findIndex(arg => arg.startsWith(`--${argName}`));
  
  if (argIndex === -1) {
    if (required) {
      process.stderr.write(`Error: Provide ${argName} via --${argName}\n`);
      process.exit(1);
    } else {
      return undefined;
    }
  }

  const arg = process.argv[argIndex];
  let argValue;

  if (arg.includes('=')) {
    argValue = arg.split('=')[1];
  } else {
    const nextArgvValue = process.argv[argIndex + 1];

    if (nextArgvValue && !nextArgvValue.startsWith('--')) {
      argValue = nextArgvValue;
    }
  }

  if (!argValue && required) {
    process.stderr.write(`Error: Argument ${argName} is missing value\n`);
    process.exit(1);
  }

  return argValue;
}