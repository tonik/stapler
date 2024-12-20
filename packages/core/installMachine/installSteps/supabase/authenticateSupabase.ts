import { execSync } from 'child_process';
import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils/logger';

export const authenticateSupabase = async () => {
  await logger.withSpinner('Checking Supabase authentication...', async (spinner) => {
    try {
      await execAsync('npx supabase projects list');
      spinner.succeed('Logged in');
    } catch (error) {
      try {
        spinner.stop();
        execSync('npx supabase login', { stdio: 'inherit' });
        spinner.start('Logging in to Supabase...');
        spinner.succeed('Logged in');
      } catch {
        spinner.fail('Failed to log in to Supabase.');
        console.error('Please log in manually with "supabase login" and re-run "stplr".');
        process.exit(1);
      }
    }
  });
};
