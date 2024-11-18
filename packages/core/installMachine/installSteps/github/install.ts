import inquirer from 'inquirer';
import { logger } from '../../../utils/logger';
import { installGitHubCLI, isGitHubCLIInstalled } from './ghInstaller';
import {
  authenticateGitHub,
  createGitHubRepository,
  fetchGitHubUsername,
  isGitHubAuthenticated,
  setupGitRepository,
} from './repositoryManager';
import { InstallMachineContext } from '../../../types';

interface ProjectRepositoryOptions {
  projectName: string;
  stateData: InstallMachineContext['stateData'];
}

// Helper function to check if GitHub CLI is installed
const checkGitHubCLI = async () => {
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
        const installed = installGitHubCLI();
        if (!installed) {
          spinner.fail('GitHub CLI installation failed. Exiting...');
          console.error('GitHub CLI installation failed. Exiting...');
          process.exit(1);
        }
        spinner.succeed('GitHub CLI installed successfully.');
      } else {
        spinner.fail('GitHub CLI is not installed. Please install GitHub CLI and try again.');
        console.error('GitHub CLI is not installed. Please install GitHub CLI and try again.');
        process.exit(1);
      }
    } else {
      spinner.succeed('GitHub CLI is already installed.');
    }
  });
};

// Helper function to ensure GitHub authentication
const ensureGitHubAuthentication = async () => {
  await logger.withSpinner('github', 'Checking authentication status...', async (spinner) => {
    if (isGitHubAuthenticated()) {
      spinner.succeed('You are already logged in.');
      return; // Exit early if authenticated
    }

    spinner.fail("It looks like you're not logged in...");
    await authenticateGitHub();
  });
};

export const initializeRepository = async (options: ProjectRepositoryOptions) => {
  const { projectName, stateData } = options;

  await checkGitHubCLI();
  await ensureGitHubAuthentication();

  // Retrieve GitHub username once
  const username = await fetchGitHubUsername();
  if (!username) {
    console.error('Failed to retrieve username. Aborting repository creation.');
    process.exit(1);
  }

  // Check if the repository exists and create it
  await createGitHubRepository(projectName, username, stateData);

  await setupGitRepository();
};
