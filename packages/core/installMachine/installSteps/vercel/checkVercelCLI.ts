import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils';

const isVercelCLIInstalled = async (): Promise<boolean> => {
  try {
    await execAsync('vercel --version');
    return true;
  } catch (error) {
    return false;
  }
};

const installVercelCLI = async (): Promise<boolean> => {
  logger.log('Installing Vercel CLI...');
  try {
    await execAsync('npm i -g vercel@latest');
    return true;
  } catch (error) {
    console.error('Failed to install Vercel CLI.');
    logger.log('Please install it manually from: https://vercel.com/docs/cli');
    return false;
  }
};

export const checkVercelCLI = async () => {
  await logger.withSpinner('vercel', 'Checking if Vercel CLI is installed...', async (spinner) => {
    if (!isVercelCLIInstalled()) {
      logger.log('Vercel CLI is not installed.');

      const installed = await installVercelCLI();
      if (!installed) {
        spinner.fail('Vercel CLI installation failed. Exiting...');
        console.error('Vercel CLI installation failed. Exiting...');
        process.exit(1);
      }
      spinner.succeed('CLI: Ready');
    } else {
      spinner.succeed('CLI: Ready');
    }
  });
};
