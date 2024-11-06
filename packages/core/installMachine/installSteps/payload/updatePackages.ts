import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const updatePackages = () => {
  logWithColoredPrefix('payload', 'Updating Next and React to their respective release candidates...');
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc --reporter silent`, {
    stdio: 'inherit',
  });

  logWithColoredPrefix('payload', 'Installing necessary packages...');
  execSync(`pnpm i pg sharp --reporter silent`, {
    stdio: 'inherit',
  });
};
