import { logger } from '../../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

export const moveFilesToAppDir = async () => {
  await logger.withSpinner('payload', 'Moving files to (app) directory...', async (spinner) => {
    try {
      await execAsync(
        `mkdir -p ./app/\\(app\\) && find ./app -maxdepth 1 ! -path './app' ! -path './app/\\(app\\)' -exec mv {} ./app/\\(app\\)/ \\;`,
      );
      spinner.succeed('Files moved.');
    } catch (error) {
      spinner.fail(
        'Failed to move files from ./app to ./app/(app). Please move the files manually and re-run "stplr".',
      );
      console.error(error);
    }
  });
};
