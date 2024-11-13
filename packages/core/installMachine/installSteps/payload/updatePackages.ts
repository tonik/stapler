import { execSync } from 'child_process';
import { logger } from '../../../utils/logger';

export const updatePackages = () => {
  logger.log('payload', 'Updating Next and React to their respective release candidates...');
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc --reporter silent`, {
    stdio: 'inherit',
  });

  logger.log('payload', 'Installing necessary packages...');
  execSync(`pnpm i pg sharp --reporter silent`, {
    stdio: 'inherit',
  });
};
