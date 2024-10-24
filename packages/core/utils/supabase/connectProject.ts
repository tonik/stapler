import { exec, execSync } from 'child_process';
import inquirer from 'inquirer';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';
import { updateEnvFile } from '../shared/updateEnvFile';
import { getSupabaseKeys, parseProjectsList } from './utils';
import { promisify } from 'util';

const execAsync = promisify(exec);

const instructions = [
  '\n=== Instructions for Supabase Integration with GitHub and Vercel ===',
  '🖇️ 1. You will be redirected to your Supabase project dashboard',
  '🖇️ 2. Find the "GitHub" section and click "Connect".',
  '   - Follow the prompts to connect Supabase with your GitHub repository.',
  '🖇️ 3. Then, find the "Vercel" section and click "Connect".',
  '   - Follow the prompts to connect Supabase with your Vercel project.',
  '\n 🖇️ Please note that these steps require manual configuration in the Supabase interface.\n',
];

export const connectSupabaseProject = async (projectName: string, currentDir: string) => {
  try {
    console.log('🖇️ Getting information about newly created Supabase project...');
    const { stdout: projectsList } = await execAsync('supabase projects list');
    const projects = parseProjectsList(projectsList);
    const newProject = projects.find((project) => project.name === projectName);

    if (!newProject || !newProject.refId) {
      throw new Error(
        `Could not find Supabase project "${projectName}". Please ensure the project exists and you have the correct permissions.`,
      );
    }

    console.log('🖇️ Getting Supabase project keys...');
    const { stdout: projectAPIKeys } = await execAsync(`supabase projects api-keys --project-ref ${newProject.refId}`);

    const { anonKey, serviceRoleKey } = getSupabaseKeys(projectAPIKeys);

    if (!anonKey || !serviceRoleKey) {
      throw new Error('Failed to retrieve Supabase API keys. Please check your project configuration.');
    }

    const SUPABASE_URL = `https://${newProject.refId}.supabase.co/`;

    console.log(`🖇️ Saving keys to .env...`);
    await updateEnvFile({
      currentDir,
      pairs: [
        ['SUPABASE_ANON_KEY', anonKey],
        ['SUPABASE_SERVICE_ROLE_KEY', serviceRoleKey],
        ['SUPABASE_URL', SUPABASE_URL],
      ],
    });

    console.log('🖇️ Linking Supabase project...');
    execSync(`supabase link --project-ref ${newProject.refId}`, { stdio: 'inherit' });

    for (const instruction of instructions) {
      console.log(instruction);
    }

    await continueOnAnyKeypress('🖇️ When you are ready to be redirected to the Supabase page press any key');
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
        `🖇️ You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject.refId}/settings/integrations`,
      );
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('🖇️  Error connecting Supabase project:', errorMessage);
    throw error;
  }
};
