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


// Helper function to ensure GitHub authentication
const ensureGitHubAuthentication = () => {
  console.log('🖇️  Checking GitHub authentication status...');

  // Check if the user is already authenticated
  if (isGitHubAuthenticated()) {
    console.log('🖇️  You are already logged in to GitHub.');
    return; // Exit early if authenticated
  }

  if (!isGitHubAuthenticated()) {
    console.error(`🖇️  It looks like you're not logged in...`);
    authenticateGitHub();
  }
};

export const initializeRepository = async (options: ProjectOptions) => {
  const { projectName, visibility } = options;


  ensureGitHubAuthentication();

  // Retrieve GitHub username once
  const username = await fetchGitHubUsername();
  if (!username) {
    console.error('🖇️  Failed to retrieve GitHub username. Aborting repository creation.');
    process.exit(1);
  }

  // Check if the repository exists and create it
  const repoName = await createGitHubRepository(projectName, visibility, username);
  if (!repoName) {
    console.error(
      '🖇️  Failed to create GitHub repository. Check your permissions or if the repository already exists.',
    );
    process.exit(1);
  }

  await setupGitRepository(repoName, username);
};
