import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const createTurboRepo = async (name: string) => {
  await logger.withSpinner('turborepo', 'Initializing...', async (spinner) => {
    try {
      await execAsync(`npx create-turbo@latest ${name} -m pnpm`);
      spinner.succeed('Initialized!');
    } catch (error) {
      spinner.fail('Failed to initialize!');
      console.error(error);
    }
  });
};
