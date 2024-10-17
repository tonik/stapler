import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';
import { updateEnvFile } from '../shared/updateEnvFile';
import { getSupabaseKeys, parseProjectsList } from './utils';

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
  console.log('🖇️ Getting information about newly created Supabase project...');
  const projectsList = execSync('supabase projects list', { encoding: 'utf-8' });
  const projects = parseProjectsList(projectsList);
  const newProject = projects.find((project) => project.name === projectName);

  console.log('🖇️ Getting Supabase project keys...');
  const projectAPIKeys = execSync(`supabase projects api-keys --project-ref ${newProject?.id}`, { encoding: 'utf-8' });

  const SUPABASE_ANON_KEY = getSupabaseKeys(projectAPIKeys).anonKey;
  const SUPABASE_SERVICE_ROLE_KEY = getSupabaseKeys(projectAPIKeys).serviceRoleKey;
  const SUPABASE_URL = `https://${newProject?.id}.supabase.co/`;

  console.log(`🖇️ Saving keys to .env...`);
  await updateEnvFile({
    currentDir,
    projectName,
    pairs: [
      ['SUPABASE_ANON_KEY', `${SUPABASE_ANON_KEY}`],
      ['SUPABASE_SERVICE_ROLE_KEY', `${SUPABASE_SERVICE_ROLE_KEY}`],
      ['SUPABASE_URL', `${SUPABASE_URL}`],
    ],
  });

  console.log('🖇️ Linking Supabase project...');
  execSync(`supabase projects link ${newProject?.id}`, {
    stdio: 'inherit',
  });

  for (const instruction of instructions) {
    console.log(instruction);
  }

  await continueOnAnyKeypress('🖇️ When you are ready to be redirected to the Supabase page press any key');

  execSync(`open https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`);

  const { isIntegrationReady } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isIntegrationReady',
      message: '🖇️ Have you completed the GitHub and Vercel integration setup?',
      default: false,
    },
  ]);

  if (!isIntegrationReady) {
    // Uncomment after CLI progress task is done.
    // console.log("🖇️ Run \x1b[36mcreate-stapler-app\x1b[0m again when you've completed the integration.");
    console.log(
      `🖇️ You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`,
    );
  }
};
