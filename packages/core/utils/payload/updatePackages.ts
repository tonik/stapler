import { execSync } from 'child_process';
import { getLogColor } from '../shared/getLogColor';

export const updatePackages = () => {
  getLogColor('payload', 'Updating Next and React to their respective release candidates...');
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc --reporter silent`, {
    stdio: 'inherit',
  });

  getLogColor('payload', 'Installing necessary packages...');
  execSync(`pnpm i pg sharp --reporter silent`, {
    stdio: 'inherit',
  });
};
