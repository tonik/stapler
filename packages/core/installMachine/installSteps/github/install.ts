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

interface ProjectRepositoryOptions {
  projectName: string;
  visibility: 'public' | 'private';
}

// Helper function to check if GitHub CLI is installed
const checkGitHubCLI = async () => {
  logger.log('github', 'Checking if GitHub CLI is installed...');
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
        console.error('GitHub CLI installation failed. Exiting...');
        process.exit(1);
      }
    } else {
      console.error('GitHub CLI is not installed. Please install GitHub CLI and try again.');
      process.exit(1);
    }
  }
};

// Helper function to ensure GitHub authentication
const ensureGitHubAuthentication = () => {
  logger.log('github', 'Checking authentication status...');

  // Check if the user is already authenticated
  if (isGitHubAuthenticated()) {
    logger.log('github', 'You are already logged in.');
    return; // Exit early if authenticated
  }

  if (!isGitHubAuthenticated()) {
    console.error(`It looks like you're not logged in...`);
    authenticateGitHub();
  }
};

export const initializeRepository = async (options: ProjectRepositoryOptions) => {
  const { projectName, visibility } = options;
  logger.log('github', `Initializing repository for project "${projectName}"...`);

  checkGitHubCLI();
  ensureGitHubAuthentication();

  // Retrieve GitHub username once
  const username = await fetchGitHubUsername();
  if (!username) {
    console.error('Failed to retrieve GitHub username. Aborting repository creation.');
    process.exit(1);
  }

  // Check if the repository exists and create it
  const repoName = await createGitHubRepository(projectName, visibility, username);
  if (!repoName) {
    console.error('Failed to create GitHub repository. Check your permissions.');
    process.exit(1);
  }

  await setupGitRepository(repoName, username);
};
