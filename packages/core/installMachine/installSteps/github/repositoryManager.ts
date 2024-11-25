import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';
import { InstallMachineContext } from '../../../types';
import { fetchOrganizations } from './fetchOrganizations';

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

export const fetchGitHubUsername = async (): Promise<string> => {
  try {
    const username = execSync('echo "$(gh api user --jq .login)"', { stdio: 'pipe' }).toString().trim();
    return username;
  } catch (error) {
    console.error('Error fetching username:', error);
    process.exit(1);
  }
};

export const createGitHubRepository = async (
  projectName: string,
  username: string,
  stateData: InstallMachineContext['stateData'],
) => {
  let repoName = projectName;
  stateData.githubCandidateName = repoName; // Update state with confirmed name

  // Fetch organizations and build choices for the prompt
  const organizations = await fetchOrganizations();
  const accountChoices = [
    { name: `${username} (personal account)`, value: username },
    ...organizations.map((org: { writable: any; name: any }) => ({
      name: org.writable ? org.name : chalk.gray(`${org.name} (read-only)`),
      value: org.name,
      disabled: org.writable ? false : 'No write access',
    })),
  ];

  // Prompt the user to select an account or organization
  const { selectedAccount } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedAccount',
      message: 'Select the account or organization to create the repository under:',
      choices: accountChoices,
    },
  ]);
  stateData.selectedAccount = selectedAccount; // Update state with selected account

  await logger.withSpinner('github', 'Checking if repository already exists...', async (spinner) => {
    try {
      const repoNameJSON = await execAsync(`echo "$(gh repo view ${selectedAccount}/${projectName} --json name)"`);
      const repoExists = repoNameJSON.stdout.trim().includes(`{"name":"${projectName}"}`);

      if (repoExists) {
        spinner.stop();
        const newRepoName = await generateUniqueRepoName(projectName);
        const { confirmedName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'confirmedName',
            message: 'The repository already exists. Please confirm or modify the repository name:',
            default: newRepoName,
          },
        ]);
        repoName = confirmedName;
        stateData.githubCandidateName = confirmedName; // Update state with confirmed name
      }
      spinner.stop();
    } catch (error) {
      spinner.fail('Error checking repository existence.');
      console.error(error);
    }
  });

  await logger.withSpinner('github', `Creating repository: ${selectedAccount}/${repoName}...`, async (spinner) => {
    try {
      spinner.stop();
      const { repositoryVisibility } = await inquirer.prompt([
        {
          type: 'list',
          name: 'repositoryVisibility',
          message: 'Choose the repository visibility:',
          choices: ['public', 'private'],
          default: 'public',
        },
      ]);
      const visibilityFlag = repositoryVisibility === 'public' ? '--public' : '--private';
      const command = `gh repo create ${selectedAccount}/${repoName} ${visibilityFlag}`;
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

export const setupGitRepository = async () => {
  await logger.withSpinner('github', `Setting up Git for the repository...`, async (spinner) => {
    const commands = [`git init`, `git add .`];
    await executeCommands(commands);
    spinner.succeed('Git setup complete.');
  });
};

export const pushToGitHub = async (selectedAccount: string, githubCandidateName: string) => {
  await logger.withSpinner('github', 'Pushing changes...', async (spinner) => {
    const commands = [
      `git add .`,
      `git branch -M main`,
      `git remote add origin git@github.com:${selectedAccount}/${githubCandidateName}.git`,
      `git commit -m "feat: initial commit"`,
      `git push -u origin main`,
    ];

    await executeCommands(commands);
    spinner.succeed('Changes pushed.');
  });
};
