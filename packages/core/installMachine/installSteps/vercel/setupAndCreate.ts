import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';
import chalk from 'chalk';

const getUserName = (): string | null => {
  try {
    const user = execSync('npx vercel whoami', { stdio: 'pipe', encoding: 'utf-8' });
    return user;
  } catch {
    return null;
  }
};

export const setupAndCreateVercelProject = async () => {
  const vercelUserName = getUserName();

  if (!vercelUserName) {
    logWithColoredPrefix('vercel', 'Logging in...');
    try {
      execSync('npx vercel login', { stdio: 'inherit' });
    } catch (error) {
      logWithColoredPrefix('vercel', [
        'Oops! Something went wrong while logging in...',
        '\nYou might already be logged in with this email in another project.',
        '\nIn this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
      ]);
      try {
        execSync('npx vercel login', { stdio: 'inherit' });
      } catch {
        logWithColoredPrefix('vercel', [
          'Please check the error above and try again.',
          '\nAfter successfully logging in with "vercel login", please run create-stapler-app again.\n',
        ]),
          process.exit(1);
      }
    }
  } else {
    logWithColoredPrefix('vercel', `You are logged in as \x1b[36m${vercelUserName.toString().trim()}\x1b[0m`);
  }

  logWithColoredPrefix('vercel', 'Linking project...');
  logWithColoredPrefix(
    'vercel',
    `NOTE: You need to specify manually ${chalk.cyan('in which directory is your code located')}, should be: ${chalk.greenBright('./apps/web')}`,
  );
  execSync('npx vercel link', { stdio: 'inherit' });
};
