import * as readline from 'readline';
import { logWithColoredPrefix } from './logWithColoredPrefix';

export const continueOnAnyKeypress = async (message: string): Promise<void> => {
  logWithColoredPrefix('supabase', message.toString().trim());

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

  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  return new Promise<void>((resolve) => {
    resolvePromise = resolve;
    process.stdin.on('keypress', onKeyPress);
  });
};
