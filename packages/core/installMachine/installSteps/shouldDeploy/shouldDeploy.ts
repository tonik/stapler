import chalk from 'chalk';
import Enquirer from 'enquirer';
import { CHECK_MARK_COLOR, LEFT_PADDING, logger, QUESTION_MARK } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean): Promise<boolean> => {
  if (!shouldContinue) {
    logger.log('Local deployment completed');
    return false;
  }

  try {
    const enquirer = new Enquirer();
    const answers = (await enquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: chalk.whiteBright(
          'Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)?',
        ),
        initial: true,
        prefix: ' ' + LEFT_PADDING + QUESTION_MARK,
        format(value) {
          return `${chalk.hex(CHECK_MARK_COLOR)(value)}`;
        },
      },
    ])) as { continue: boolean };

    const spinnerMessage = answers.continue ? 'Continuing with remote setup...' : 'Local deployment completed';
    logger.log(spinnerMessage);

    return answers.continue;
  } catch (error) {
    logger.log('Local deployment failed');
    console.error('Error during local deployment:', error);
    return false;
  }
};
