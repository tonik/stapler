import inquirer from 'inquirer';
import { logger } from 'stplr-utils';

export const shouldDeploy = async (shouldContinue: boolean) => {
  await logger.withSpinner('deployment', 'Deciding deployment...', async (spinner) => {
    if (!shouldContinue) {
      spinner.succeed('Local installation completed.');
      return false;
    }
    try {
      const answers = (await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continue',
          message:
            'Local installation completed. Would you like to continue with remote setup (GitHub, Supabase, Vercel)?',
          default: true,
        },
      ])) as { continue: boolean };
      spinner.succeed("Let's continue with remote setup.");

      return answers.continue;
    } catch (error) {
      spinner.fail('Prettifying failed');
      console.error('Error during prettifying:', error);
    }
  });
};
