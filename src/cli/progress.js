import process from "node:process";

const ansiColorReset = '\x1b[0m';
function hexColorToAnsi(hex) {
  if (!hex || !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex)) {
    return;
  }

  let cleanHex = hex.slice(1);
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(s => s + s).join('');
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `\x1b[38;2;${r};${g};${b}m`;
}

const writeProgressInPlace = (persent, size, color) => {
  if (persent > 100 || persent < 0) {
    throw new Error('Invalid persentage')
  }
  const filledChar = "█";
  const emptyChar = " ";
  const ansiColor = hexColorToAnsi(color);

  
  const filledAmount = Math.floor(persent / 100 * size);
  const emptyAmount = size - filledAmount;
  const bar = `${filledChar.repeat(filledAmount)}${emptyChar.repeat(emptyAmount)}`;
  const coloredBar = ansiColor? `${ansiColor}${bar}${ansiColorReset}` : bar;

  process.stdout.write(`\r[${coloredBar}] ${persent}%`);
}


const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%

  const colorArg = process.argv.find(arg => arg.startsWith('--color'))?.split('=')?.[1];
  const sizeArg = process.argv.find(arg => arg.startsWith('--size'))?.split('=')?.[1];
  const timeArg = process.argv.find(arg => arg.startsWith('--time'))?.split('=')?.[1];

  const time = timeArg && !Number.isNaN(timeArg) ? Number(timeArg): 5000;
  const size = sizeArg && !Number.isNaN(sizeArg) ? Number(sizeArg): 30;
  const startTime = new Date();

  if (time < 5000 || 10000 < time ) {
    throw Error('Time should be in range [5s, 10s]');
  }
  if (size < 10 || 50 < size) {
    throw Error('Size should be in range [10, 50]');
  }

  const intereval = setInterval(() => {
    const timeDiff = Math.min(new Date() - startTime, time);
    const timeDiffPersent = timeDiff ? Math.round(timeDiff * 100 / time) : 0;

    writeProgressInPlace(timeDiffPersent, size, colorArg);

    if (time <= timeDiff) {
      clearInterval(intereval);
      process.stdout.write('\n');
    }
  }, 100);
};

progress();
