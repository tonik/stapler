import inquirer from 'inquirer';
import { logger } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean): Promise<boolean> => {
  return await logger.withSpinner('deployment', 'Deciding next steps...', async (spinner) => {
    if (!shouldContinue) {
      spinner.succeed('Local deployment completed');
      return false;
    }

    try {
      spinner.stop();
      const answers = (await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message:
            'Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)?',
          default: true,
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
