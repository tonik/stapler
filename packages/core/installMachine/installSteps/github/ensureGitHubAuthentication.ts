import { logger } from '../../../../utils/logger';
import { authenticateGitHub, isGitHubAuthenticated } from './repositoryManager';

export const ensureGitHubAuthentication = async () => {
  await logger.withSpinner('github', 'Checking authentication status...', async (spinner) => {
    if (isGitHubAuthenticated()) {
      spinner.succeed('Logged in');
      return;
    }

    spinner.fail("It looks like you're not logged in...");
    await authenticateGitHub();
  });
};
