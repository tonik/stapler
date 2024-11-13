import { execSync } from 'node:child_process';
import { logger } from '../../../utils/logger';

export const deployVercelProject = async () => {
  execSync('npx vercel git connect', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf-8',
  });

  logger.log('vercel', 'Creating production deployment...');

  const productionUrl = execSync('vercel --prod', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
  });

  if (productionUrl) {
    logger.log('vercel', `You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m`);
  } else {
    logger.log('vercel', 'Failed to create production deployment.');
    return;
  }
};
