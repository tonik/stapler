import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const installDependencies = async () => {
  await logger.withSpinner('supabase', 'Installing dependencies...', async (spinner) => {
    await execAsync('pnpm i --reporter silent');
    spinner.succeed('Dependencies installed.');
  });
};
