import { execSync } from 'node:child_process';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const deployVercelProject = async () => {
  execSync('npx vercel git connect', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf-8',
  });

  logWithColoredPrefix('vercel', 'Creating production deployment...');

  const productionUrl = execSync('vercel --prod', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
  });

  if (productionUrl) {
    logWithColoredPrefix('vercel', `You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m`);
  } else {
    logWithColoredPrefix('vercel', 'Failed to create production deployment.');
    return;
  }
};
