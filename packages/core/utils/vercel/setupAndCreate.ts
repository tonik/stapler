import { execSync } from 'child_process';
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
    console.log(chalk.bgBlack.hex('#FFF')('▲ Logging in to Vercel...'));
    try {
      execSync('npx vercel login', { stdio: 'inherit' });
    } catch (error) {
      console.log(
        chalk.bgBlack.hex('#FFF')(
          '▲ Oops! Something went wrong while logging in to Vercel...',
          '\n▲ You might already be logged in with this email in another project.',
          '\n▲ In this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
        ),
      );
      try {
        execSync('npx vercel login', { stdio: 'inherit' });
      } catch {
        console.log(
          chalk.bgBlack.hex('#FFF')(
            '▲ Please check the error above and try again.',
            '\n▲ After successfully logging in with "vercel login", please run create-stapler-app again.\n',
          ),
        );
        process.exit(1);
      }
    }
  } else {
    console.log(chalk.bgBlack.hex('#FFF')(`▲ You are logged to Vercel as \x1b[36m${vercelUserName}\x1b[0m`));
  }

  console.log(chalk.bgBlack.hex('#FFF')('▲ Initializing Vercel project...'));
  execSync('npx vercel init');

  console.log(chalk.bgBlack.hex('#FFF')('\n▲ Linking Vercel project...'));
  execSync('npx vercel link', { stdio: 'inherit' });
};
