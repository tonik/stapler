import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';

import { getSupabaseKeys, parseProjectsList } from './utils';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

const execAsync = promisify(exec);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectSupabaseProject = async (projectName: string, currentDir: string) => {
  try {
    logWithColoredPrefix('supabase', 'Getting information about newly created project...');
    const { stdout: projectsList } = await execAsync('npx supabase projects list');
    const projects = parseProjectsList(projectsList);
    const newProject = projects.find((project) => project.name === projectName);

    if (!newProject || !newProject.refId) {
      throw new Error(
        `Could not find Supabase project "${projectName}". Please ensure the project exists and you have the correct permissions.`,
      );
    }

    logWithColoredPrefix('supabase', 'Getting project keys...');
    const { stdout: projectAPIKeys } = await execAsync(
      `npx supabase projects api-keys --project-ref ${newProject.refId}`,
    );

    const { anonKey, serviceRoleKey } = getSupabaseKeys(projectAPIKeys);

    if (!anonKey || !serviceRoleKey) {
      throw new Error('Failed to retrieve Supabase API keys. Please check your project configuration.');
    }

    logWithColoredPrefix('supabase', 'Linking project...');
    execSync(`npx supabase link --project-ref ${newProject.refId}`, { stdio: 'inherit' });

    logWithColoredPrefix('supabase', [
      chalk.bold('=== Instructions for integration with GitHub and Vercel ==='),
      '\n1. You will be redirected to your project dashboard',
      '\n2. Find the "GitHub" section and click "Connect".',
      '\n   - Follow the prompts to connect with your GitHub repository.',
      '\n3. Then, find the "Vercel" section and click "Connect".',
      '\n   - Follow the prompts to connect with your Vercel project.',
      chalk.italic('\nNOTE: These steps require manual configuration in the Supabase interface.'),
    ]);

    for (let i = 3; i > 0; i--) {
      logWithColoredPrefix('supabase', `Redirecting to the Supabase dashboard in ${i} seconds...`);
      await delay(1000); // 1-second countdown delay
    }

    logWithColoredPrefix('supabase', 'Opening the dashboard in your browser...');
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
      logWithColoredPrefix(
        'supabase',
        `You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`,
      ),
        process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error connecting Supabase project:', errorMessage);
    throw error;
  }
};
