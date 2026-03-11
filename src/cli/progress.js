import process from "node:process";
import { getArg } from '../utils/getArg.js';

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

const writeProgressInPlace = (persent, length, color) => {
  if (persent > 100 || persent < 0) {
    throw new Error('Invalid persentage')
  }
  const filledChar = "█";
  const emptyChar = " ";
  const ansiColor = hexColorToAnsi(color);
  
  const filledAmount = Math.floor(persent / 100 * length);
  const emptyAmount = length - filledAmount;
  const bar = `${filledChar.repeat(filledAmount)}${emptyChar.repeat(emptyAmount)}`;
  const coloredBar = ansiColor? `${ansiColor}${bar}${ansiColorReset}` : bar;

  process.stdout.write(`\r[${coloredBar}] ${persent}%`);
}

const progress = () => {
  // Write your code here
  // Simulate progress bar from 0% to 100% over ~5 seconds
  // Update in place using \r every 100ms
  // Format: [████████████████████          ] 67%

  const colorArg = getArg('color');
  const lengthArg = getArg('length');
  const durationArg = getArg('duration');
  const intervalArg = getArg('interval');

  const duration = durationArg && !Number.isNaN(durationArg) ? Number(durationArg): 5000;
  const interval = intervalArg && !Number.isNaN(intervalArg) ? Number(intervalArg): 5000;
  const length = lengthArg && !Number.isNaN(lengthArg) ? Number(lengthArg): 30;
  const startTime = new Date();

  // This is my personal addition to validate data
  if (duration < 3000 || 10000 < duration) {
    throw Error('Duration should be in range [3s, 10s]');
  }
  if (intereval < 50 || 300 < intereval) {
    throw Error('Interval should be in range [50ms, 300ms]');
  }
  if (length < 10 || 50 < length) {
    throw Error('Length should be in range [10, 50]');
  }

  const intereval = setInterval(() => {
    const durationDiff = Math.min(new Date() - startTime, duration);
    const durationDiffPersent = durationDiff ? Math.round(durationDiff * 100 / duration) : 0;

    writeProgressInPlace(durationDiffPersent, length, colorArg);

    if (duration <= durationDiff) {
      clearInterval(intereval);
      process.stdout.write('\n');
    }
  }, interval);
};

progress();
