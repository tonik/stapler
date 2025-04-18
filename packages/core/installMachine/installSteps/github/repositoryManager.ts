import chalk from 'chalk';
import { execSync, spawnSync } from 'child_process';
import Enquirer from 'enquirer';
import { CHECK_MARK_COLOR, LABEL_SECONDARY_TEXT_COLOR, LEFT_PADDING, logger, QUESTION_MARK } from 'stplr-utils';
import { InstallMachineContext } from '../../../types';
import { execAsync } from '../../../utils/execAsync';
import { fetchOrganizations } from './fetchOrganizations';

export interface ProjectChoice {
  name: string;
  value: string;
}

const generateUniqueRepoName = async (baseName: string): Promise<string> => {
  const cleanBaseName = baseName.replace(/-\d+$/, ''); // Clean base name

  const uniqueRepoName = await logger.withSpinner('Generating unique repo name...', async (spinner) => {
    try {
      await execAsync(`gh repo view ${cleanBaseName}`);
      let counter = 2;
      while (true) {
        const candidateName = `${cleanBaseName}-v${counter}`;
        try {
          await execAsync(`gh repo view ${candidateName}`);
          counter++;
        } catch {
          return candidateName;
        }
      }
    } catch (error) {
      return cleanBaseName;
    }
  });
  return uniqueRepoName;
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
    { name: username, value: username, message: chalk.whiteBright(username + 'personal account') },
    ...organizations.map((org: { writable: any; name: any }) => ({
      name: org.name,
      value: chalk.hex(CHECK_MARK_COLOR)(LEFT_PADDING + org.name),
      message: org.writable ? chalk.whiteBright(org.name) : chalk.gray(`${org.name} (read-only)`),
      disabled: org.writable ? false : 'No write access',
    })),
  ];

  // Prompt the user to select an account or organization
  const enquirer = new Enquirer();
  const { selectedAccount } = (await enquirer.prompt([
    {
      type: 'select',
      name: 'selectedAccount',
      message: chalk.whiteBright('Select the account or organization to create the repository under:'),
      choices: accountChoices,
      prefix: ' ' + LEFT_PADDING + QUESTION_MARK,
      format(value) {
        return chalk.hex(CHECK_MARK_COLOR)(value);
      },
    },
  ])) as { selectedAccount: string };

  stateData.selectedAccount = selectedAccount; // Update state with selected account

  const repoExists = await logger.withSpinner('Checking repository...', async (spinner) => {
    try {
      const repoNameJSON = await execAsync(`echo "$(gh repo view ${selectedAccount}/${projectName} --json name)"`);
      const repoExists = repoNameJSON.stdout.trim().includes(`{"name":"${projectName}"}`);
      return repoExists;
    } catch (error) {
      spinner.fail('Failed to update project settings.');
      console.error('Error during Vercel project settings update:', error);
    }
  });

  if (repoExists) {
    const newRepoName = await generateUniqueRepoName(projectName);
    const enquirer = new Enquirer();
    const { confirmedName } = (await enquirer.prompt([
      {
        type: 'input',
        name: 'confirmedName',
        message: chalk.whiteBright('The repository already exists. Please confirm or modify the repository name:'),
        initial: newRepoName,
        prefix: ' ' + LEFT_PADDING + QUESTION_MARK,
        format(value) {
          return chalk.hex(CHECK_MARK_COLOR)(value);
        },
      },
    ])) as { confirmedName: string };
    repoName = confirmedName;
    stateData.githubCandidateName = confirmedName; // Update state with confirmed name
  }
  const questions = [
    {
      type: 'select' as const,
      name: 'repositoryVisibility',
      message: chalk.whiteBright('Choose the repository visibility:'),
      prefix: ' ' + LEFT_PADDING + QUESTION_MARK,
      choices: [
        { name: 'public', value: 'public', message: chalk.whiteBright('public') },
        { name: 'private', value: 'private', message: chalk.whiteBright('private') },
      ],
      initial: 'public',
      format(value: string) {
        return `${chalk.hex(CHECK_MARK_COLOR)(value)}`;
      },
    },
  ];

  const response = (await enquirer.prompt(questions)) as { repositoryVisibility: string };

  const { repositoryVisibility } = response;

  await logger.withSpinner(`Creating repository: ${selectedAccount}/${repoName}...`, async (spinner) => {
    try {
      const visibilityFlag = repositoryVisibility === 'public' ? '--public' : '--private';
      const command = `gh repo create ${selectedAccount}/${repoName} ${visibilityFlag}`;
      await execAsync(command);
      spinner.succeed(`Repository created: ${chalk.hex(LABEL_SECONDARY_TEXT_COLOR)(repoName)}`);
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
