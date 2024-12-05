import { logger } from '../../../utils/logger';
import { authenticateGitHub, isGitHubAuthenticated } from './repositoryManager';

export const ensureGitHubAuthentication = async () => {
  await logger.withSpinner('github', 'Checking authentication status...', async (spinner) => {
    if (isGitHubAuthenticated()) {
      spinner.succeed('Already logged in.');
      return; // Exit early if authenticated
    }

    spinner.fail("It looks like you're not logged in...");
    await authenticateGitHub();
  });
};
