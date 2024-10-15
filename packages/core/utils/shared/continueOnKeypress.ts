import * as readline from 'readline';

export const continueOnAnyKeypress = async (message: string): Promise<void> => {
  console.log(message);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const cleanup = () => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdin.removeListener('keypress', onKeyPress);
    rl.close();
  };

  let resolvePromise: () => void;

  const onKeyPress = () => {
    cleanup();
    resolvePromise();
  };

  return new Promise<void>((resolve) => {
    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', onKeyPress);
  }).finally(cleanup);
};
