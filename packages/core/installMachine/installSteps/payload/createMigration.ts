import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const createMigration = async () => {
  await logger.withSpinner('payload', 'Creating migration...', async (spinner) => {
    try {
      await execAsync('mkdir migrations');
      await execAsync('npx payload migrate:create');
      spinner.succeed('Migration created.');
    } catch (error) {
      spinner.fail('Failed to create migration.');
      console.error(error);
      process.exit(1);
    }
  });
};
