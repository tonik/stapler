import { execSync } from 'child_process';

export function isGitHubAuthenticated(): boolean {
  try {
    // Use execSync to run the command and capture output
    const result = execSync('gh auth status', { stdio: 'pipe' }).toString().trim();

    // Check if the output includes "Logged in" - this is to be changed in the future but couldn't find a better way
    return result.includes('Logged in');
  } catch (error) {
    return false;
  }
}

export async function authenticateGitHub(): Promise<boolean> {
  console.log('🖇️ Attempting to authenticate with GitHub...');

  execSync('gh auth login', { stdio: 'inherit' });

  // Immediately check authentication status after login attempt
  const isAuthenticated = isGitHubAuthenticated();

  if (isAuthenticated) {
    console.log('🖇️ Authentication was successful.');
    return true;
  } else {
    console.error('🖇️ Authentication failed after login attempt.');
    return false;
  }
}

export async function fetchGitHubUsername(): Promise<string | null> {
  try {
    // Run the command without --jq first to inspect raw output
    const username = execSync('echo "$(gh api user --jq .login)"', { stdio: 'pipe' }).toString().trim();

    if (username) {
      console.log(`🖇️ Hello \x1b[36m${username}\x1b[0m!`);
      return username;
    } else {
      console.log('🖇️ No username returned or an error occurred.');
      return null;
    }
  } catch (error) {
    console.error('🖇️ Error fetching GitHub username:', error);
    return null;
  }
}

export async function createGitHubRepository(
  projectName: string,
  repositoryVisibility: 'public' | 'private',
  username: string,
): Promise<boolean> {
  console.log(`🖇️ Checking if repository already exists...`);

  // Check if the repository exists
  const repoCheckCommand = `echo "$(gh repo view ${username}/${projectName} --json name)"`;
  const existingRepo = execSync(repoCheckCommand, { stdio: 'pipe' }).toString().trim();

  if (existingRepo) {
    console.error(`🖇️ Repository "${projectName}" already exists.`);
    return false; // Return false to indicate the repo was not created
  }

  console.log(`🖇️ Creating GitHub repository: \x1b[36m${projectName}\x1b[0m`);

  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';
  const command = `gh repo create ${projectName} ${visibility}`;

  const result = execSync(command);

  if (result) {
    console.log(`🖇️ Repository successfully created at \x1b[36m${result}\x1b[0m`);
    return true; // Return true to indicate success
  }

  console.error('🖇️ Failed to create GitHub repository.');
  return false; // Return false on failure
}

const executeCommands = (commands: string[]) => {
  for (const cmd of commands) {
    const result = execSync(cmd, { stdio: 'pipe' });
    if (!result) {
      console.error(`🖇️ Failed to execute command: ${cmd}`);
    }
  }
};

// New function to set up the local Git repository
export async function setupGitRepository() {
  console.log(`🖇️ Setting up Git for the repository...`);

  // Set the remote origin and push to GitHub
  const commands = [`git init`, `git add .`];

  executeCommands(commands);
}

export async function pushToGitHub(projectName: string) {
  console.log('🖇️ Pushing changes to GitHub...');

  const username = await fetchGitHubUsername();
  const commands = [
    `git add .`,
    `git branch -M main`,
    `git remote add origin git@github.com:${username}/${projectName}.git`,
    `git commit -m "feat: initial commit"`,
    `git push -u origin main`,
  ];
  executeCommands(commands);
}
