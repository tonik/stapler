import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

export const updatePackages = async () => {
  await logger.withSpinner('payload', `Updating React to it's respective release candidate...`, async (spinner) => {
    try {
      await execAsync(`pnpm up react@rc react-dom@rc eslint-config-next@rc --reporter silent`);
      spinner.succeed(`Updated React to it's respective release candidate.`);
    } catch (error) {
      spinner.fail(`Failed to update React to it's respective release candidate.`);
      console.error(error);
    }
  });

  await logger.withSpinner('payload', 'Installing necessary packages...', async (spinner) => {
    try {
      await execAsync(`pnpm i pg sharp --reporter silent`);
      spinner.succeed('Installed necessary packages.');
    } catch (error) {
      spinner.fail('Failed to install necessary packages.');
      console.error(error);
    }
  });
};
