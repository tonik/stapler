import { execSync } from 'child_process';
import chalk from 'chalk';
import { logWithColoredPrefix } from '../shared/logWithColoredPrefix';

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
    logWithColoredPrefix('vercel', `You are logged as ${chalk.cyan(vercelUserName)}`);
  }

  logWithColoredPrefix('vercel', 'Initializing project...');
  execSync('npx vercel init');

  logWithColoredPrefix('vercel', '\nLinking project...');
  execSync('npx vercel link', { stdio: 'inherit' });
};
