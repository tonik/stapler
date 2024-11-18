import { execSync } from 'child_process';
import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const deployVercelProject = async (projectName: string) => {
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

  const productionUrl = execSync('npx vercel --prod', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
  });

  const domains = execSync('npx vercel alias list', {
    stdio: ['pipe'],
    encoding: 'utf8',
  });

  const regex = new RegExp(`\\b${projectName}\\.vercel\\.app\\b`, 'g');
  const shortestDomainArr = domains.match(regex);

  if (productionUrl && shortestDomainArr?.length) {
    logger.log(
      'vercel',
      `You can access your production deployment at: \x1b[36mhttps://${shortestDomainArr[0]}\x1b[0m`,
    );
  } else {
    logger.log('vercel', 'Failed to create production deployment.');
    return;
  }
};
