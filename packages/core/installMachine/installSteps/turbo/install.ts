import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../../utils/logger';

const checkPnpmVersion = async () => {
  await logger.withSpinner('turborepo', 'Checking pnpm version...', async (spinner) => {
    try {
      // Run the command to check the pnpm version
      const { stdout } = await execAsync('pnpm --version');
      spinner.succeed(`Found pnpm version ${stdout.trim()}.`);
    } catch (error) {
      spinner.fail('Failed to find pnpm version. Visit https://pnpm.io/installation to install pnpm.');
      console.error(error);
    }
  });
};

export const createTurbo = async (name: string) => {
  await logger.withSpinner('turborepo', 'Initializing...', async (spinner) => {
    try {
      // Check the pnpm version
      await checkPnpmVersion();
      // Run the command to create a turbo repo
      await execAsync(`npx create-turbo ${name} -m pnpm`);
      spinner.succeed('Initialized.');
    } catch (error) {
      spinner.fail('Failed to initialize.');
      console.error(error);
    }
  });
};
