import {
  isGitHubAuthenticated,
  createGitHubRepository,
  fetchGitHubUsername,
  authenticateGitHub,
} from './repositoryManager';
import { installGitHubCLI, isGitHubCLIInstalled } from './ghInstaller';

interface ProjectOptions {
  projectName: string;
  repositoryVisibility: 'public' | 'private';
}

// GitHub CLI - check if installed, if not install
// Check if use is authenticated, if not auth, get his Username just to prompt it and then create repository

export async function createProject(options: ProjectOptions) {
  const { projectName, repositoryVisibility } = options;

  console.log('Checking GitHub CLI installation...');

  if (!isGitHubCLIInstalled()) {
    console.log('GitHub CLI is not installed.');
    const installed = installGitHubCLI();
    if (!installed) {
      process.exit(1);
    }
  }

  console.log('Checking GitHub authentication...');

  if (!isGitHubAuthenticated()) {
    if (!authenticateGitHub()) {
      console.log('You are not authenticated with GitHub CLI.');
      console.log('Please run the following command in your terminal to authenticate:');
      console.log('gh auth login');
      console.log('After authentication, run this script again.');
      process.exit(1);
    }
  }

  const username = fetchGitHubUsername();
  if (username) {
    console.log(`Authenticated as GitHub user: ${username}`);
  } else {
    console.log('Authenticated with GitHub, but unable to retrieve username.');
  }

  // Create GitHub repository
  const repoCreated = createGitHubRepository(projectName, repositoryVisibility);
  if (!repoCreated) {
    console.log('Failed to create GitHub repository. Exiting...');
    process.exit(1);
  }

  // Continue with project creation
  console.log(`Creating repository: ${projectName}`);

  console.log('\x1b[32m%s\x1b[0m', `Success: Your ${projectName} repository is ready!`);
}
