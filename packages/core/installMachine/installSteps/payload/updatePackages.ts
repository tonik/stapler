import { logger } from 'stplr-utils';
import { execAsync } from '../../../utils/execAsync';

export const updatePackages = async () => {
  await logger.withSpinner('payload', `Updating React to version 19...`, async (spinner) => {
    try {
      await execAsync(`pnpm up react@19 react-dom@19 --reporter silent`);
      spinner.succeed(`Updated React to version 19.`);
    } catch (error) {
      spinner.fail(`Failed to update React to version 19.`);
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
