import { execSync } from 'child_process';
import chalk from 'chalk';
import { logger } from '../../../utils/logger';

const getUsername = (): string | null => {
  try {
    const user = execSync('npx vercel whoami', { stdio: 'pipe', encoding: 'utf-8' }).trim();
    return user || null;
  } catch {
    return null;
  }
};

const loginIfNeeded = () => {
  logger.log('vercel', 'Logging in...');
  try {
    execSync('npx vercel login', { stdio: 'inherit' });
  } catch (error) {
    logger.log('vercel', [
      'Oops! Something went wrong while logging in...',
      '\nYou might already be logged in with this email in another project.',
      '\nIn this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
    ]);
    try {
      execSync('npx vercel login', { stdio: 'inherit' });
    } catch {
      logger.log('vercel', [
        'Please check the error above and try again.',
        '\nAfter successfully logging in with "vercel login", please run create-stapler-app again.\n',
      ]);
      process.exit(1);
    }
  }
};

export const linkVercelProject = async () => {
  let vercelUserName = getUsername();

  if (!vercelUserName) {
    loginIfNeeded();
    vercelUserName = getUsername(); // Retry getting username after login
  }

  logger.log('vercel', `You are logged in as ${chalk.cyan(vercelUserName)}`);

  logger.log('vercel', 'Linking project...');
  execSync('npx vercel link --yes', { stdio: 'ignore' });
};
