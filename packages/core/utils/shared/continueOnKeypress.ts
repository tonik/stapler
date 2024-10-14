import * as readline from 'readline';

export const continueOnAnyKeypress = async (message: string): Promise<void> => {
  console.log(message);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const onKeyPress = () => {
      cleanup();
      resolve();
    };

    const cleanup = () => {
      rl.close();
      process.stdin.removeListener('keypress', onKeyPress);
      readline.emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
    };

    readline.emitKeypressEvents(process.stdin, rl);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', onKeyPress);
  });
};
