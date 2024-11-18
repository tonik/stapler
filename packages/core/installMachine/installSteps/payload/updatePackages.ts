import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

export const updatePackages = async () => {
  await logger.withSpinner(
    'payload',
    'Updating Next and React to their respective release candidates...',
    async (spinner) => {
      try {
        await execAsync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc --reporter silent`);
        spinner.succeed('Updated Next and React to their respective release candidates!');
      } catch (error) {
        spinner.fail('Failed to update Next and React to their respective release candidates!');
        console.error(error);
      }
    },
  );

  await logger.withSpinner('payload', 'Installing necessary packages...', async (spinner) => {
    try {
      await execAsync(`pnpm i pg sharp @payloadcms/db-vercel-postgres --reporter silent`);
      spinner.succeed('Installed necessary packages!');
    } catch (error) {
      spinner.fail('Failed to install necessary packages!');
      console.error(error);
    }
  });
};
