import chalk from 'chalk';
import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const startLocalDatabase = async () => {
  await logger.withSpinner('supabase', 'Starting local database...', async (spinner) => {
    try {
      await execAsync('npx supabase start');
      spinner.succeed('Local database started.');
    } catch (error) {
      spinner.fail(`Failed to start local database. Is your ${chalk.hex('#0db7ed')('Docker')} daemon running?`);
      console.error(`\n${error}`);
      process.exit(1);
    }
  });
};
