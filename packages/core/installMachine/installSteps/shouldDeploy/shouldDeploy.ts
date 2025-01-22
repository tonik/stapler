import chalk from 'chalk';
import Enquirer from 'enquirer';
import { CHECK_MARK_COLOR, logger, QUESTION_MARK } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean): Promise<boolean> => {
  return await logger.withSpinner('Deciding next steps...', async (spinner) => {
    if (!shouldContinue) {
      spinner.succeed('Local deployment completed');
      return false;
    }

    try {
      spinner.stop();
      const enquirer = new Enquirer();
      const answers = (await enquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message: chalk.whiteBright(
            'Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)?',
          ),
          initial: true,
          prefix: QUESTION_MARK,
          format(value) {
            return `${chalk.hex(CHECK_MARK_COLOR)(value)}`;
          },
          result(value) {
            process.stdout.write('\x1B[1A');
            process.stdout.write('\x1B[2K');
            process.stdout.write('\x1B[1A');
            process.stdout.write('\x1B[2K');

            logger.log(
              `Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)? (Y/n) · ${chalk.hex(CHECK_MARK_COLOR)(value)}`,
            );

            return value;
          },
        },
      ])) as { continue: boolean };

      spinner.start();
      const spinnerMessage = answers.continue ? 'Continuing with remote setup...' : 'Local deployment completed';
      spinner.succeed(spinnerMessage);

      return answers.continue;
    } catch (error) {
      spinner.fail('Local deployment failed');
      console.error('Error during local deployment:', error);
      return false;
    }
  });
};
