import {
  isGitHubAuthenticated,
  createGitHubRepository,
  fetchGitHubUsername,
  authenticateGitHub,
  setupGitRepository,
} from './repositoryManager';
import { installGitHubCLI, isGitHubCLIInstalled } from './ghInstaller';

interface ProjectOptions {
  projectName: string;
  visibility: 'public' | 'private';
}

// Helper function to check if GitHub CLI is installed
function checkGitHubCLI() {
  console.log('🖇️ Checking GitHub CLI installation...');
  if (!isGitHubCLIInstalled()) {
    console.log('🖇️ GitHub CLI is not installed.');
    const installed = installGitHubCLI();
    if (!installed) {
      console.error('🖇️ GitHub CLI installation failed. Exiting...');
      process.exit(1);
    }
  }
}

// Helper function to ensure GitHub authentication
function ensureGitHubAuthentication() {
  console.log('🖇️ Checking GitHub authentication status...');

  // Check if the user is already authenticated
  if (isGitHubAuthenticated()) {
    console.log('🖇️ You are already logged in to GitHub.');
    return; // Exit early if authenticated
  }

  if (!isGitHubAuthenticated()) {
    console.error(`🖇️ It looks like you're not logged in...`);
    authenticateGitHub();
  }
}

export async function initializeRepository(options: ProjectOptions) {
  const { projectName, visibility } = options;

  checkGitHubCLI();
  ensureGitHubAuthentication();

  // Retrieve GitHub username once
  const username = await fetchGitHubUsername();
  if (!username) {
    console.error('🖇️ Failed to retrieve GitHub username. Aborting repository creation.');
    process.exit(1);
  }

  // Check if the repository exists and create it
  const repoCreated = await createGitHubRepository(projectName, visibility, username);
  if (!repoCreated) {
    console.error('🖇️ Failed to create GitHub repository. Check your permissions or if the repository already exists.');
    process.exit(1);
  }

  await setupGitRepository();
}
