import { execSync } from 'child_process';
import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils';
import { getShortestVercelAlias } from './utils/getShortestVercelAlias';
import { type InstallMachineContext } from '../../../types';

export const deployVercelProject = async (stateData: InstallMachineContext['stateData']) => {
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

  logger.log('Creating production deployment...');

  const productionUrl = execSync('npx vercel --prod', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
  });

  const shortestVercelAlias = await getShortestVercelAlias(productionUrl);

  if (!productionUrl) logger.log('Failed to create production deployment.');

  stateData.prettyDeploymentUrl = productionUrl;

  if (shortestVercelAlias) stateData.prettyDeploymentUrl = shortestVercelAlias;
};
