import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { promisify } from 'util';
import chalk from 'chalk';
import { getSupabaseKeys, parseProjectsList } from './utils';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';
import { getVercelTokenFromAuthFile } from '../../../utils/getVercelTokenFromAuthFile';
import { getProjectIdFromVercelConfig } from '../../../utils/getProjectIdFromVercelConfig';

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
      '\n2. Find Vercel Integration and click "Add new project connection".',
      '\n   - Follow the prompts to connect with your Vercel project.',
      '\n3. (Optional) Find GitHub Connections and click "Add new project connection".',
      '\n   - Follow the prompts to connect with your GitHub repository.',
      chalk.italic('\nNOTE: These steps require manual configuration in the Supabase interface.'),
    ]);

    for (let i = 3; i > 0; i--) {
      logWithColoredPrefix('supabase', `Redirecting to the Supabase dashboard in ${i} seconds...`);
      await delay(1000); // 1-second countdown delay
    }

    logWithColoredPrefix('supabase', 'Opening the dashboard in your browser...');
    await execAsync(`open https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`);

    let attempts = 0;
    const maxAttempts = 30; // Set to check for 5 minutes (5 * 60 seconds)
    const interval = 5000; // Check every 5 seconds

    const token = await getVercelTokenFromAuthFile();
    const vercelProjectId = await getProjectIdFromVercelConfig();

    logWithColoredPrefix('supabase', 'Checking for Vercel integration...');
    while (attempts < maxAttempts) {
      process.stdout.write(`Attempt ${attempts + 1}/${maxAttempts}\n`);
      const envVarsSet = await fetch(`https://api.vercel.com/v9/projects/${vercelProjectId}/env`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: 'get',
      })
        .catch((error) => {
          console.error('Failed to fetch Vercel environment variables:', error);
          process.exit(1);
        })
        .then((response) => response.json());

      const supabaseUrl = envVarsSet.envs.find((env: { key: string }) => env.key === 'SUPABASE_URL')?.value;
      if (supabaseUrl) {
        logWithColoredPrefix('supabase', 'Vercel integration found!');
        break;
      }

      // Wait for the specified interval before checking again
      await delay(interval);
      attempts++;

      if (attempts === maxAttempts) {
        logWithColoredPrefix(
          'supabase',
          `Timeout reached. You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`,
        );
        process.exit(1);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error connecting Supabase project:', errorMessage);
    throw error;
  }
};
