import { execAsync } from "../../../utils/execAsync";
import { logger } from "../../../utils/logger";

export const loginToSupabase = async () => {
  await logger.withSpinner('supabase', 'Logging in...', async (spinner) => {
    try {
      await execAsync('npx supabase projects list');
      spinner.succeed('Already logged in.');
    } catch (error) {
      try {
        await execAsync('npx supabase login');
        spinner.succeed('Logged in successfully.');
      } catch {
        spinner.fail('Failed to log in to Supabase.');
        console.error('Please log in manually with "supabase login" and re-run "stplr".');
        process.exit(1);
      }
    }
  });
};
