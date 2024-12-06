import { execSync } from 'child_process';
import { logger } from 'stplr-utils';

export const authenticateVercel = async () => {
  await logger.withSpinner('vercel', 'Logging in to Vercel...', async (spinner) => {
    try {
      execSync('npx vercel whoami', { stdio: 'pipe' });

      spinner.succeed('Logged in');
    } catch (error) {
      try {
        execSync('vercel login', { stdio: 'inherit' });
        spinner.succeed('Logged in successfully.');
      } catch {
        spinner.fail('Failed to log in.');
        logger.log('vercel', [
          'Oops! Something went wrong while logging in to Vercel...',
          '\nYou might already be logged in with this email in another project.',
          '\nIn this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
        ]);

        try {
          execSync('vercel login', { stdio: 'inherit' });
          spinner.succeed('Logged in');
        } catch {
          spinner.fail('Failed to log in.');
          logger.log('vercel', [
            'Please check the error above and try again.',
            '\nAfter successfully logging in with "vercel login", please run stplr again.\n',
          ]);
          process.exit(1);
        }
      }
    }
  });
};
