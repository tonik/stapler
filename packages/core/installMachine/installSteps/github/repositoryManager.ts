import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

const execAsync = promisify(exec);

const generateUniqueRepoName = async (baseName: string): Promise<string> => {
  // Remove any existing numbering pattern from the end
  const cleanBaseName = baseName.replace(/-\d+$/, '');

  // Try the base name first
  try {
    await execAsync(`gh repo view ${cleanBaseName}`);
    logWithColoredPrefix('github', `Repository "${cleanBaseName}" already exists.`);
    // If we get here, the repo exists, so we need a new name
  } catch (error) {
    // If repo doesn't exist, we can use the clean base name
    if (error) {
      return cleanBaseName;
    }
  }

  // Find the next available number
  let counter = 2; // Start with 2 since it's more natural than 1
  while (true) {
    const candidateName = `${cleanBaseName}-v${counter}`;
    try {
      await execAsync(`gh repo view ${candidateName}`);
      logWithColoredPrefix('github', `Repository "${candidateName}" already exists.`);
      counter++;
    } catch (error) {
      if (error) {
        return candidateName;
      }
    }
  }
};

export const isGitHubAuthenticated = (): boolean => {
  try {
    // Use execSync to run the command and capture output
    const result = execSync('gh auth status', { stdio: 'pipe' }).toString().trim();

    // Check if the output includes "Logged in" - this is to be changed in the future but couldn't find a better way
    return result.includes('Logged in');
  } catch (error) {
    return false;
  }
};

export const authenticateGitHub = async (): Promise<boolean> => {
  logWithColoredPrefix('github', 'Attempting to authenticate...');

  execSync('gh auth login', { stdio: 'inherit' });

  // Immediately check authentication status after login attempt
  const isAuthenticated = isGitHubAuthenticated();

  if (isAuthenticated) {
    return true;
  } else {
    console.error('Authentication failed after login attempt.');
    return false;
  }
};

export const fetchGitHubUsername = async (): Promise<string | null> => {
  logWithColoredPrefix('github', `Retrieving username...`);
  try {
    const username = execSync('echo "$(gh api user --jq .login)"', { stdio: 'pipe' }).toString().trim();

    if (username) {
      return username;
    } else {
      logWithColoredPrefix('github', 'No username returned or an error occurred.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

export const createGitHubRepository = async (
  projectName: string,
  repositoryVisibility: 'public' | 'private',
  username: string,
): Promise<string | undefined> => {
  logWithColoredPrefix('github', `Checking if repository already exists...`);

  // Check if the repository exists
  const repoCheckCommand = `echo "$(gh repo view ${username}/${projectName} --json name)"`;
  const existingRepo = execSync(repoCheckCommand, { stdio: 'pipe' }).toString().trim();
  let repoName = projectName;

  if (existingRepo) {
    const newRepoName = await generateUniqueRepoName(projectName);
    const { confirmedName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'confirmedName',
        message: 'Please confirm or modify the repository name:',
        default: newRepoName,
        validate: (input: string) => {
          if (!/^[a-zA-Z0-9._-]+$/.test(input)) {
            return 'Repository name can only contain letters, numbers, dots, hyphens, and underscores';
          }
          return true;
        },
      },
    ]);
    repoName = confirmedName;
  }

  logWithColoredPrefix('github', `Creating repository: ${repoName}`);

  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';
  const command = `gh repo create ${repoName} ${visibility}`;

  const result = execSync(command);

  if (result) {
    logWithColoredPrefix('github', `Repository successfully created at ${chalk.cyan(result.toString().trim())}`);
    return repoName; // Return true to indicate success
  }

  console.error('Failed to create GitHub repository.');
  return; // Return false on failure
};
// New function to set up the local Git repository

const executeCommands = (commands: string[]) => {
  for (const cmd of commands) {
    const result = execSync(cmd, { stdio: 'pipe' });
    if (!result) {
      console.error(`Failed to execute command: ${cmd}`);
      process.exit(1);
    }
  }
};

// New function to set up the local Git repository
export const setupGitRepository = async (projectName: string, username: string) => {
  logWithColoredPrefix('github', `Setting up Git for the repository...`);

  // Set the remote origin and push to GitHub
  const commands = [`git init`, `git add .`];

  executeCommands(commands);
};

export const pushToGitHub = async (projectName: string) => {
  logWithColoredPrefix('github', 'Pushing changes to GitHub...');

  const username = await fetchGitHubUsername();
  const commands = [
    `git add .`,
    `git branch -M main`,
    `git remote add origin git@github.com:${username}/${projectName}.git`,
    `git commit -m "feat: initial commit"`,
    `git push -u origin main`,
  ];

  executeCommands(commands);
};
