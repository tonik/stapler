import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

const generateUniqueRepoName = async (baseName: string): Promise<string> => {
  const cleanBaseName = baseName.replace(/-\d+$/, ''); // Clean base name

  try {
    await execAsync(`gh repo view ${cleanBaseName}`);
    logger.log('github', `Repository "${cleanBaseName}" already exists.`);
    let counter = 2;
    while (true) {
      const candidateName = `${cleanBaseName}-v${counter}`;
      try {
        await execAsync(`gh repo view ${candidateName}`);
        logger.log('github', `Repository "${candidateName}" already exists.`);
        counter++;
      } catch {
        return candidateName;
      }
    }
  } catch {
    return cleanBaseName;
  }
};

export const isGitHubAuthenticated = (): boolean => {
  try {
    const result = execSync('gh auth status', { stdio: 'pipe' }).toString().trim();
    return result.includes('Logged in');
  } catch {
    return false;
  }
};

export const authenticateGitHub = async () => {
  await logger.withSpinner('github', 'Attempting to authenticate...', async (spinner) => {
    try {
      execSync('gh auth login', { stdio: 'inherit' });
      const isAuthenticated = isGitHubAuthenticated();
      if (isAuthenticated) {
        spinner.succeed('Authentication successful.');
        return true;
      } else {
        spinner.fail('Authentication failed.');
        return false;
      }
    } catch (error) {
      spinner.fail('Authentication failed.');
      console.error('Authentication error:', error);
      return false;
    }
  });
};

export const fetchGitHubUsername = async (): Promise<string | null> => {
  try {
    const username = execSync('echo "$(gh api user --jq .login)"', { stdio: 'pipe' }).toString().trim();
    return username || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

export const createGitHubRepository = async (
  projectName: string,
  repositoryVisibility: 'public' | 'private',
  username: string,
) => {
  let repoName = projectName;

  await logger.withSpinner('github', 'Checking if repository already exists...', async (spinner) => {
    try {
      const repoCheckCommand = `echo "$(gh repo view ${username}/${projectName} --json name)"`;
      const existingRepo = execAsync(repoCheckCommand).toString().trim();

      if (existingRepo) {
        spinner.stop();
        const newRepoName = await generateUniqueRepoName(projectName);
        const { confirmedName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'confirmedName',
            message: 'Please confirm or modify the repository name:',
            default: newRepoName,
            validate: (input: string) => /^[a-zA-Z0-9._-]+$/.test(input) || 'Invalid repository name.',
          },
        ]);
        repoName = confirmedName;
      }
      spinner.stop();
    } catch (error) {
      spinner.fail('Error checking repository existence');
      console.error(error);
    }
  });

  await logger.withSpinner('github', `Creating repository: ${repoName}...`, async (spinner) => {
    try {
      const visibilityFlag = repositoryVisibility === 'public' ? '--public' : '--private';
      const command = `gh repo create ${repoName} ${visibilityFlag}`;
      await execAsync(command);
      spinner.succeed(`Repository created: ${chalk.cyan(repoName)}`);
      return repoName;
    } catch (error) {
      spinner.fail('Failed to create repository.');
      console.error('Error creating repository:', error);
      return;
    }
  });

  return repoName;
};

const executeCommands = async (commands: string[]) => {
  for (const cmd of commands) {
    try {
      await execAsync(cmd);
    } catch (error) {
      console.error('Error executing command:', error);
      process.exit(1);
    }
  }
};

export const setupGitRepository = async (projectName: string, username: string) => {
  await logger.withSpinner('github', `Setting up Git for the repository...`, async (spinner) => {
    const commands = [`git init`, `git add .`];
    await executeCommands(commands);
    spinner.succeed('Git setup complete.');
  });
};

export const pushToGitHub = async (projectName: string) => {
  const username = await fetchGitHubUsername();
  await logger.withSpinner('github', 'Pushing changes...', async (spinner) => {
    const commands = [
      `git add .`,
      `git branch -M main`,
      `git remote add origin git@github.com:${username}/${projectName}.git`,
      `git commit -m "feat: initial commit"`,
      `git push -u origin main`,
    ];

    await executeCommands(commands);
    spinner.succeed('Changes pushed.');
  });
};
