import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const createMigration = async () => {
  logger.withSpinner('payload', 'Creating migration...', async (spinner) => {
    try {
      execAsync('mkdir migrations');
      execAsync('npx payload migrate:create');
      spinner.succeed('Migration created.');
    } catch (error) {
      spinner.fail('Failed to create migration.');
      console.error(error);
    }
  });
};
