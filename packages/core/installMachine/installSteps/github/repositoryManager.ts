import { execSync, spawnSync } from 'child_process';
import Enquirer from 'enquirer';
import chalk from 'chalk';
import { LEFT_PADDING, logger } from 'stplr-utils';
import { execAsync } from '../../../utils/execAsync';
import { InstallMachineContext } from '../../../types';
import { fetchOrganizations } from './fetchOrganizations';

export interface ProjectChoice {
  name: string;
  value: string;
}

const generateUniqueRepoName = async (baseName: string): Promise<string> => {
  const cleanBaseName = baseName.replace(/-\d+$/, ''); // Clean base name

  try {
    await execAsync(`gh repo view ${cleanBaseName}`);
    logger.log(`Repository "${cleanBaseName}" already exists.`);
    let counter = 2;
    while (true) {
      const candidateName = `${cleanBaseName}-v${counter}`;
      try {
        await execAsync(`gh repo view ${candidateName}`);
        logger.log(`Repository "${candidateName}" already exists.`);
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
  await logger.withSpinner('Attempting to authenticate...', async (spinner) => {
    try {
      spinner.start('Authenticating...');
      const isAuthenticated = isGitHubAuthenticated();

      if (isAuthenticated) {
        spinner.succeed('Logged in');
        return true;
      }

      spinner.stop();

      try {
        const result = spawnSync('gh', ['auth', 'login'], {
          stdio: 'inherit',
          shell: true,
        });
        spinner.succeed('Logged in');
        return true;
      } catch (error) {
        spinner.fail('Logging in failed.');
        console.error('Logging in failed:', error);
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
    { name: username, value: username, message: `${username} (personal account)` },
    ...organizations.map((org: { writable: any; name: any }) => ({
      name: org.name,
      value: org.name,
      message: org.writable ? org.name : chalk.gray(`${org.name} (read-only)`),
      disabled: org.writable ? false : 'No write access',
    })),
  ];

  // Prompt the user to select an account or organization
  const enquirer = new Enquirer();
  const { selectedAccount } = (await enquirer.prompt([
    {
      type: 'select',
      name: 'selectedAccount',
      message: 'Select the account or organization to create the repository under:',
      choices: accountChoices,
      prefix: LEFT_PADDING,
    },
  ])) as { selectedAccount: string };

  stateData.selectedAccount = selectedAccount; // Update state with selected account

  await logger.withSpinner('Checking if repository already exists...', async (spinner) => {
    try {
      const repoNameJSON = await execAsync(`echo "$(gh repo view ${selectedAccount}/${projectName} --json name)"`);
      const repoExists = repoNameJSON.stdout.trim().includes(`{"name":"${projectName}"}`);

      if (repoExists) {
        spinner.stop();
        const newRepoName = await generateUniqueRepoName(projectName);
        const enquirer = new Enquirer();
        const { confirmedName } = (await enquirer.prompt([
          {
            type: 'input',
            name: 'confirmedName',
            message: 'The repository already exists. Please confirm or modify the repository name:',
            initial: newRepoName,
            prefix: LEFT_PADDING,
          },
        ])) as { confirmedName: string };
        repoName = confirmedName;
        stateData.githubCandidateName = confirmedName; // Update state with confirmed name
      }
      spinner.stop();
    } catch (error) {
      spinner.fail('Error checking repository existence.');
      console.error(error);
    }
  });

  await logger.withSpinner(`Creating repository: ${selectedAccount}/${repoName}...`, async (spinner) => {
    try {
      spinner.stop();
      const enquirer = new Enquirer();
      const questions = [
        {
          type: 'select' as const,
          name: 'repositoryVisibility',
          message: 'Choose the repository visibility:',
          prefix: LEFT_PADDING,
          choices: [
            { name: 'public', value: 'public' },
            { name: 'private', value: 'private' },
          ],
          initial: 'public',
        },
      ];

      const response = (await enquirer.prompt(questions)) as { repositoryVisibility: string };

      const { repositoryVisibility } = response;

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
  await logger.withSpinner(`Setting up Git for the repository...`, async (spinner) => {
    const commands = [`git init`, `git add .`];
    await executeCommands(commands);
    spinner.succeed('Git setup complete.');
  });
};

export const pushToGitHub = async (selectedAccount: string, githubCandidateName: string) => {
  await logger.withSpinner('Pushing changes...', async (spinner) => {
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
