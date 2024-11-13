import { execSync } from 'child_process';
import chalk from 'chalk';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

const getUsername = async (): Promise<string | null> => {
  try {
    const user = execSync('npx vercel whoami', { stdio: 'pipe', encoding: 'utf-8' }).trim();
    return user;
  } catch {
    return null;
  }
};

const loginIfNeeded = async () => {
  await logger.withSpinner('vercel', 'Logging in...', async (spinner) => {
    try {
      execAsync('npx vercel login');
    } catch (error) {
      logger.log('vercel', [
        'Oops! Something went wrong while logging in...',
        '\nYou might already be logged in with this email in another project.',
        '\nIn this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
      ]);

      // Retry login if it fails
      try {
        execAsync('npx vercel login');
        spinner.succeed('Logged in successfully.');
      } catch {
        spinner.fail('Failed to log in.');
        logger.log('vercel', [
          'Please check the error above and try again.',
          '\nAfter successfully logging in with "vercel login", please run create-stapler-app again.\n',
        ]);
        process.exit(1);
      }
    }
  });
};

export const linkVercelProject = async () => {
  let vercelUserName = await getUsername();

  if (!vercelUserName) {
    await loginIfNeeded();
    vercelUserName = await getUsername(); // Retry getting username after login
  }

  await logger.withSpinner('vercel', 'Linking project...', async (spinner) => {
    try {
      await execAsync('npx vercel link --yes');
      spinner.succeed('Project linked successfully.');
    } catch (error) {
      spinner.fail('Failed to install.');
      console.error('Error during Payload installation:', error);
    }
  });
};
