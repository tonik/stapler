import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { promisify } from 'util';
import gradient from 'gradient-string';

const execAsync = promisify(exec);

const githubGradient = gradient([
  { color: '#3B8640', pos: 0 },
  { color: '#8256D0', pos: 1 },
]);

const generateUniqueRepoName = async (baseName: string): Promise<string> => {
  // Remove any existing numbering pattern from the end
  const cleanBaseName = baseName.replace(/-\d+$/, '');

  // Try the base name first
  try {
    await execAsync(`gh repo view ${cleanBaseName}`);
    console.error(`Repository "${cleanBaseName}" already exists.`);
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
      console.error(`Repository "${candidateName}" already exists.`);
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
  console.log(githubGradient('Attempting to authenticate with GitHub...'));

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
  try {
    // Run the command without --jq first to inspect raw output
    const username = execSync('echo "$(gh api user --jq .login)"', { stdio: 'pipe' }).toString().trim();

    if (username) {
      console.log(githubGradient(`Hello ${username}!`));
      return username;
    } else {
      console.log(githubGradient('No username returned or an error occurred.'));
      return null;
    }
  } catch (error) {
    console.error('Error fetching GitHub username:', error);
    return null;
  }
};

export const createGitHubRepository = async (
  projectName: string,
  repositoryVisibility: 'public' | 'private',
  username: string,
): Promise<string | undefined> => {
  console.log(githubGradient(`Checking if repository already exists...`));

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

  console.log(githubGradient(`Creating GitHub repository: ${repoName}`));

  const visibility = repositoryVisibility === 'public' ? '--public' : '--private';
  const command = `gh repo create ${repoName} ${visibility}`;

  const result = execSync(command);

  if (result) {
    console.log(githubGradient(`Repository successfully created at ${result}`));
    return repoName; // Return true to indicate success
  }

  console.error('Failed to create GitHub repository.');
  return; // Return false on failure
};

// New function to set up the local Git repository
export const setupGitRepository = async (projectName: string, username: string) => {
  console.log(githubGradient(`Pushing files to repository...`));

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
    const result = execSync(cmd, { stdio: 'pipe' });
    if (!result) {
      console.error(`Failed to execute command: ${cmd}`);
      process.exit(1);
    }
  }
};
