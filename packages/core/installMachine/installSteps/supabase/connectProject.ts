import { execSync } from 'child_process';
import chalk from 'chalk';
import boxen from 'boxen';
import { getSupabaseKeys, parseProjectsList } from './utils';
import { logger } from 'stplr-utils';
import { getVercelTokenFromAuthFile } from '../../../utils/getVercelTokenFromAuthFile';
import { getDataFromVercelConfig } from '../../../utils/getDataFromVercelConfig';
import { execAsync } from '../../../utils/execAsync';
import { delay } from '../../../utils/delay';

export const connectSupabaseProject = async (projectName: string, currentDir: string) => {
  try {
    // Get project information
    const newProject = await logger.withSpinner('Getting project information...', async (spinner) => {
      const { stdout: projectsList } = await execAsync('npx supabase projects list');
      const projects = parseProjectsList(projectsList);
      const project = projects.find((p) => p.name === projectName);

      if (!project || !project.refId) {
        spinner.fail('Project not found');
        throw new Error(
          `Could not find Supabase project "${projectName}". Please ensure the project exists and you have the correct permissions.`,
        );
      }

      spinner.succeed('Project found.');
      return project;
    });

    // Get API keys
    const { anonKey, serviceRoleKey } = await logger.withSpinner('Getting project API keys...', async (spinner) => {
      const { stdout: projectAPIKeys } = await execAsync(
        `npx supabase projects api-keys --project-ref ${newProject.refId}`,
      );

      const keys = getSupabaseKeys(projectAPIKeys);
      if (!keys.anonKey || !keys.serviceRoleKey) {
        spinner.fail('Failed to retrieve API keys');
        throw new Error('Failed to retrieve Supabase API keys. Please check your project configuration.');
      }

      spinner.succeed('API keys retrieved.');
      return keys;
    });

    // Link project
    logger.log('Linking project...');
    execSync(`npx supabase link --project-ref ${newProject.refId}`, {
      stdio: 'inherit',
    });

    // Display integration instructions
    console.log(
      boxen(
        chalk.bold('Supabase Integration Setup\n\n') +
          chalk.hex('#259764')('1.') +
          ' You will be redirected to your project dashboard\n' +
          chalk.hex('#259764')('2.') +
          ' Connect Vercel: "Add new project connection"\n' +
          chalk.hex('#259764')('3.') +
          ' (Optional) Connect GitHub: "Add new project connection"\n\n' +
          chalk.dim('Tip: Keep this terminal open to track the integration status'),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: '#3ABC82',
        },
      ),
    );

    // Countdown and open dashboard
    const spinner = logger.createSpinner('Preparing to open dashboard');
    spinner.start();

    for (let i = 3; i > 0; i--) {
      spinner.text = `Opening dashboard in ${chalk.hex('#259764')(i)}...`;
      await delay(1000);
    }

    spinner.text = 'Opening dashboard in your browser...';
    await execAsync(`open https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`);
    spinner.succeed('Dashboard opened.');

    // Check Vercel integration
    await logger.withSpinner('Checking integration...', async (spinner) => {
      const token = await getVercelTokenFromAuthFile();
      const { projectId: vercelProjectId, orgId: vercelTeamId } = await getDataFromVercelConfig();
      let attempts = 0;
      const maxAttempts = 30;
      const interval = 5000;

      while (attempts < maxAttempts) {
        try {
          const response = await fetch(
            `https://api.vercel.com/v9/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              method: 'get',
            },
          );

          const envVarsSet = await response.json();
          const supabaseUrl = envVarsSet.envs.find((env: { key: string }) => env.key === 'SUPABASE_URL')?.value;

          if (supabaseUrl) {
            spinner.succeed('Integration complete.');
            return true;
          }

          attempts++;
          spinner.text = `Waiting for user to complete integration...`;
          await delay(interval);
        } catch (error) {
          spinner.fail('Failed to check Vercel integration status');
          throw error;
        }
      }

      // Timeout reached
      spinner.warn('Integration check timed out');
      console.log(
        boxen(
          chalk.yellow('Integration Status Unknown\n\n') +
            'You can manually verify the integration at:\n' +
            chalk.hex('#259764')(`https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'yellow',
          },
        ),
      );

      return false;
    });
  } catch (error) {
    logger.log(error instanceof Error ? error.message : 'An unknown error occurred', false);
    throw error;
  }
};
