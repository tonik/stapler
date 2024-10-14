import { execSync } from 'child_process';

async function executeCommand(command: string, silent = false): Promise<string | null> {
  try {
    const result = execSync(command, { stdio: 'pipe' }); // Use 'pipe' to capture output
    const output = result.toString().trim(); // Convert buffer to string
    return output || null; // Ensure we return null if output is empty
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
      if (error) {
        console.error(`Command stdout: ${error.toString()}`); // Log stdout
      }
    }
    return null;
  }
}

export function isGitHubAuthenticated(): boolean {
  console.log('🖇️ Checking GitHub authentication status...');

  try {
    // Use execSync to run the command and capture output
    const result = execSync('gh auth status', { stdio: 'pipe' }).toString();

    // Check if the output includes "Logged in" - this is to be changed in the future but couldn't find a better way
    return result.includes('Logged in');
  } catch (error) {
    console.error(`🖇️ Error checking authentication status: ${error}`);
    return false;
  }
}

export async function authenticateGitHub(): Promise<boolean> {
  console.log('🖇️ Attempting to authenticate with GitHub...');

  const result = await executeCommand('gh auth login');

  if (result) {
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

  console.error('🖇️ No output from gh auth login command.');
  return false;
}

export async function fetchGitHubUsername(): Promise<string | null> {
  try {
    // Run the command without --jq first to inspect raw output
    const username = await executeCommand('echo "$(gh api user --jq .login)"');

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
  const existingRepo = await executeCommand(repoCheckCommand, true); // Silent mode to suppress output

  if (existingRepo) {
    console.error(`🖇️ Repository "${projectName}" already exists.`);
    return false; // Return false to indicate the repo was not created
  }

  console.log(`🖇️ Creating GitHub repository: \x1b[36m${projectName}\x1b[0m`);

  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';
  const command = `gh repo create ${projectName} ${visibility} --confirm`;

  const result = await executeCommand(command);

  if (result) {
    console.log(`🖇️ Repository created successfully at \x1b[36m${result}\x1b[0m`);
    return true; // Return true to indicate success
  }

  console.error('🖇️ Failed to create GitHub repository.');
  return false; // Return false on failure
}

// New function to set up the local Git repository
export async function setupGitRepository(projectName: string, username: string) {
  console.log(`🖇️ Setting up Git for the repository...`);

  // Set the remote origin and push to GitHub
  const commands = [
    `git init`,
    `git add .`,
    `git commit -m "feat: initial commit"`,
    `git branch -M main`,
    `git remote add origin git@github.com:${username}/${projectName}.git`,
    `git push -u origin main`,
  ];

  for (const cmd of commands) {
    const result = executeCommand(cmd);
    if (!result) {
      console.error(`🖇️ Failed to execute command: ${cmd}`);
      process.exit(1);
    }
  }
}
