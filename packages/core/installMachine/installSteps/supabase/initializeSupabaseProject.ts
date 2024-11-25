import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const initializeSupabaseProject = async () => {
  await logger.withSpinner('supabase', 'Initializing project...', async (spinner) => {
    try {
      await execAsync(`npx supabase init`);
      spinner.succeed('Project initialized.');
    } catch (error: any) {
      const errorMessage = error.stderr;
      if (errorMessage.includes('file exists')) {
        spinner.succeed('Configuration file already exists.');
      } else {
        spinner.fail('Failed to initialize project.');
        console.error(
          'Please review the error message below, follow the initialization instructions, and try running "stplr" again.',
        );
        process.exit(1);
      }
    }
  });
};
