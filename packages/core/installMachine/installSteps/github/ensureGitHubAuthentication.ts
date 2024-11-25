import { logger } from '../../../utils/logger';
import { isGitHubAuthenticated, authenticateGitHub } from './repositoryManager';

export const ensureGitHubAuthentication = async () => {
  await logger.withSpinner('github', 'Checking authentication status...', async (spinner) => {
    if (isGitHubAuthenticated()) {
      spinner.succeed('You are already logged in.');
      return; // Exit early if authenticated
    }

    spinner.fail("It looks like you're not logged in...");
    await authenticateGitHub();
  });
};
