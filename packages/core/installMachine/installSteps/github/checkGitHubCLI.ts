import Enquirer from 'enquirer';
import { LEFT_PADDING, logger } from 'stplr-utils';
import { isGitHubCLIInstalled, installGitHubCLI } from './ghInstaller';

export const checkGitHubCLI = async () => {
  await logger.withSpinner('Checking if GitHub CLI is installed...', async (spinner) => {
    if (!isGitHubCLIInstalled()) {
      logger.log('GitHub CLI is not installed.');
      const enquirer = new Enquirer();
      const { shouldInstallGitHubCLI } = (await enquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldInstallGitHubCLI',
          message: 'Would you like us to install GitHub CLI?',
          initial: true,
          prefix: LEFT_PADDING,
        },
      ])) as { shouldInstallGitHubCLI: boolean };

      if (shouldInstallGitHubCLI) {
        const installed = await installGitHubCLI();
        if (!installed) {
          spinner.fail('GitHub CLI installation failed. Exiting...');
          console.error('GitHub CLI installation failed. Exiting...');
          process.exit(1);
        }
        spinner.succeed('CLI: Ready');
      } else {
        spinner.fail('GitHub CLI is not installed. Please install GitHub CLI and try again.');
        console.error('GitHub CLI is not installed. Please install GitHub CLI and try again.');
        process.exit(1);
      }
    } else {
      spinner.succeed('CLI: Ready');
    }
  });
};
