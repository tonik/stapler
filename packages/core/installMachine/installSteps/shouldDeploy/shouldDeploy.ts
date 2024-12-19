import Enquirer from 'enquirer';
import { LEFT_PADDING, logger } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean): Promise<boolean> => {
  return await logger.withSpinner('deployment', 'Deciding next steps...', async (spinner) => {
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
          message:
            'Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)?',
          initial: true,
          prefix: LEFT_PADDING,
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
