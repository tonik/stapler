import { execSync } from 'child_process';
import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const deployVercelProject = async () => {
  await logger.withSpinner('vercel', 'Connecting Vercel to Git...', async (spinner) => {
    try {
      // Execute 'vercel git connect' and capture the output
      await execAsync('npx vercel git connect');
      spinner.succeed('Connected Vercel to Git successfully.');
    } catch (error) {
      spinner.fail('Failed to connect Vercel to Git.');
      console.error(error);
      return;
    }
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
