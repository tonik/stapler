import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../../utils/logger';

export const initializeStapler = async (name: string) => {
  await logger.withSpinner('stapler', 'Initializing...', async (spinner) => {
    try {
      await execAsync(`mkdir ${name}`);
      spinner.succeed('Initialized.');
    } catch (error) {
      spinner.fail('Failed to initialize.');
      console.error(error);
    }
  });
};
