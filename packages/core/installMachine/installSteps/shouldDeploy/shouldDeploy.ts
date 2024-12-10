import inquirer from 'inquirer';
import { logger } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean): Promise<boolean> => {
  return await logger.withSpinner('deployment', 'Deciding deployment...', async (spinner) => {
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
      spinner.succeed("Let's continue with remote setup.");

      return answers.continue;
    } catch (error) {
      spinner.fail('Local deployment failed');
      console.error('Error during local deployment:', error);
      return false;
    }
  });
};
