import { execSync } from 'child_process';
import { logger } from '../../../utils/logger';

export const createTurboRepo = async (name: string) => {
  logger.log('turborepo', 'Initializing...');
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
};
