import inquirer from 'inquirer';
import { logger } from 'stplr-utils';
import { isGitHubCLIInstalled, installGitHubCLI } from './ghInstaller';

export const checkGitHubCLI = async () => {
  await logger.withSpinner('github', 'Checking if GitHub CLI is installed...', async (spinner) => {
    if (!isGitHubCLIInstalled()) {
      logger.log('github', 'GitHub CLI is not installed.');
      const { shouldInstallGitHubCLI } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'shouldInstallGitHubCLI',
          message: 'Would you like us to install GitHub CLI?',
          default: true,
        },
      ]);

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
