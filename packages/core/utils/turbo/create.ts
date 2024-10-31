import { execSync } from 'child_process';
import { getLogColor } from '../shared/getLogColor';

export const createTurboRepo = async (name: string) => {
  getLogColor('turborepo', 'Initializing...');
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
