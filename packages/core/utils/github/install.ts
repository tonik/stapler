import gradient from 'gradient-string';
import { installGitHubCLI, isGitHubCLIInstalled } from './ghInstaller';
import {
  authenticateGitHub,
  createGitHubRepository,
  fetchGitHubUsername,
  isGitHubAuthenticated,
  setupGitRepository,
} from './repositoryManager';

interface ProjectOptions {
  projectName: string;
  visibility: 'public' | 'private';
}

const githubGradient = gradient([
  { color: '#3B8640', pos: 0 },
  { color: '#8256D0', pos: 1 },
]);

// Helper function to check if GitHub CLI is installed
const checkGitHubCLI = () => {
  console.log(githubGradient('Checking if GitHub CLI is installed...'));
  if (!isGitHubCLIInstalled()) {
    console.log(githubGradient('GitHub CLI is not installed.'));
    const installed = installGitHubCLI();
    if (!installed) {
      console.error('GitHub CLI installation failed. Exiting...');
      process.exit(1);
    }
  }
};

// Helper function to ensure GitHub authentication
const ensureGitHubAuthentication = () => {
  console.log(githubGradient('Checking GitHub authentication status...'));

  // Check if the user is already authenticated
  if (isGitHubAuthenticated()) {
    console.log(githubGradient('You are already logged in to GitHub.'));
    return; // Exit early if authenticated
  }

  if (!isGitHubAuthenticated()) {
    console.error(`It looks like you're not logged in...`);
    authenticateGitHub();
  }
};

export const initializeRepository = async (options: ProjectOptions) => {
  const { projectName, visibility } = options;

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
