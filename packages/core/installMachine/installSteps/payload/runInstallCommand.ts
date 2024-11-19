import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const runInstallCommand = async () => {
  await logger.withSpinner('payload', 'Installing to Next.js...', async (spinner) => {
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
