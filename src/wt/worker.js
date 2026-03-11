import { parentPort } from 'worker_threads'

// Receive array from main thread
// Sort in ascending order
// Send back to main thread


parentPort.on('message', (array) => {
  // Write your code here
  array.sort()
  parentPort.postMessage(array.sort());
});
