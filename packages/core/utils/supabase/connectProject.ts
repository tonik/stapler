import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';
import gradient from 'gradient-string';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';
import { updateEnvFile } from '../shared/updateEnvFile';
import { getSupabaseKeys, parseProjectsList } from './utils';

const execAsync = promisify(exec);

const supabaseGradient = gradient([
  { color: '#3ABC82', pos: 0 },
  { color: '#259764', pos: 1 },
]);

export const connectSupabaseProject = async (projectName: string, currentDir: string) => {
  try {
    console.log(supabaseGradient('Getting information about newly created Supabase project...'));
    const { stdout: projectsList } = await execAsync('npx supabase projects list');
    const projects = parseProjectsList(projectsList);
    const newProject = projects.find((project) => project.name === projectName);

    if (!newProject || !newProject.refId) {
      throw new Error(
        `Could not find Supabase project "${projectName}". Please ensure the project exists and you have the correct permissions.`,
      );
    }

    console.log(supabaseGradient('Getting Supabase project keys...'));
    const { stdout: projectAPIKeys } = await execAsync(
      `npx supabase projects api-keys --project-ref ${newProject.refId}`,
    );

    const { anonKey, serviceRoleKey } = getSupabaseKeys(projectAPIKeys);

    if (!anonKey || !serviceRoleKey) {
      throw new Error('Failed to retrieve Supabase API keys. Please check your project configuration.');
    }

    const SUPABASE_URL = `https://${newProject.refId}.supabase.co/`;

    console.log(supabaseGradient(`Saving keys to .env...`));
    await updateEnvFile({
      currentDir,
      pairs: [
        ['SUPABASE_ANON_KEY', anonKey],
        ['SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey],
        ['SUPABASE_URL', SUPABASE_URL],
      ],
    });

    console.log(supabaseGradient('Linking Supabase project...'));
    execSync(`npx supabase link --project-ref ${newProject.refId}`, { stdio: 'inherit' });

    console.log(
      chalk.bold(supabaseGradient('=== Instructions for Supabase Integration with GitHub and Vercel ===')),
      supabaseGradient('\n1. You will be redirected to your Supabase project dashboard'),
      supabaseGradient('\n2. Find the "GitHub" section and click "Connect".'),
      supabaseGradient('\n   - Follow the prompts to connect Supabase with your GitHub repository.'),
      supabaseGradient('\n3. Then, find the "Vercel" section and click "Connect".'),
      supabaseGradient('\n   - Follow the prompts to connect Supabase with your Vercel project.'),
      chalk.italic(supabaseGradient('\nNOTE: These steps require manual configuration in the Supabase interface.')),
    );

    await continueOnAnyKeypress('When you are ready to be redirected to the Supabase page press any key');
    await execAsync(`open https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`);

    const { isIntegrationReady } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isIntegrationReady',
        message: 'Have you completed the GitHub and Vercel integration setup?',
        default: false,
      },
    ]);

    if (!isIntegrationReady) {
      console.log(
        supabaseGradient(
          `You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`,
        ),
      );
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error connecting Supabase project:', errorMessage);
    throw error;
  }
};
