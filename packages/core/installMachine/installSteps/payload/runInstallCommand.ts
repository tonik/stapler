import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils';
import { loadEnvFile } from './utils/loadEnvFile';

export const runInstallCommand = async () => {
  loadEnvFile('../../supabase/.env');
  await logger.withSpinner('Installing to Next.js...', async (spinner) => {
    try {
      await execAsync(`echo y | npx create-payload-app --db postgres --db-connection-string ${process.env.DB_URL}`);

      spinner.succeed('Installation completed.');
    } catch (error) {
      spinner.fail('Failed to install.');
      console.error('Error during Payload installation:', error);
      process.exit(1);
    }
  });
};
