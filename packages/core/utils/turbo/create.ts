import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../shared/logWithColoredPrefix';

export const createTurboRepo = async (name: string) => {
  logWithColoredPrefix('turborepo', 'Initializing...');
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
