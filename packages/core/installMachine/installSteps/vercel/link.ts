import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils';

export const linkVercelProject = async (projectName: string) => {
  await logger.withSpinner('Linking project...', async (spinner) => {
    try {
      await execAsync(`npx vercel link --yes --project ${projectName}`);
      spinner.succeed('Project linked successfully.');
    } catch (error) {
      spinner.fail('Failed to install.');
      console.error('Error during Payload installation:', error);
    }
  });
};
