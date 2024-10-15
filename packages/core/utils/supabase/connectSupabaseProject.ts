import { execSync } from 'child_process';

import inquirer from 'inquirer';

import { continueOnAnyKeypress } from '../shared/continueOnKeypress';
import { updateEnvFile } from '../shared/updateEnvFile';
import { getAnonKey, parseProjectsList } from './utlis';

export const connectSupabaseProject = async (name: string) => {
  console.log('🖇️  Getting information about newly created Supabase project...');
  const projectsList = execSync('supabase projects list', { encoding: 'utf-8' });
  const projects = parseProjectsList(projectsList);
  const newProject = projects.find((project) => project.name === name);

  console.log('🖇️  Getting Supabase project keys...');
  const projectAPIKeys = execSync(`supabase projects api-keys --project-ref ${newProject?.id}`, { encoding: 'utf-8' });

  const SUPABASE_ANON_KEY = getAnonKey(projectAPIKeys);
  const SUPABASE_URL = `https://${newProject?.id}.supabase.co/`;

  console.log('🖇️  Saving keys to .env file...');
  await updateEnvFile({
    appFolderName: name,
    pairs: [
      ['SUPABASE_ANON_KEY', `${SUPABASE_ANON_KEY}`],
      ['SUPABASE_URL', `${SUPABASE_URL}`],
    ],
  });

  console.log('🖇️  Linking Supabase project...');
  console.log('\n=== Instructions for Supabase Integration with GitHub and Vercel ===');
  console.log('🖇️  1. You will be redirect to your supabase project dashboard');
  console.log('🖇️  2. Find the "GitHub" section and click "Connect".');
  console.log('   - Follow the prompts to connect Supabase with your GitHub repository.');
  console.log('🖇️  3. Then, find the "Vercel" section and click "Connect".');
  console.log('   - Follow the prompts to connect Supabase with your Vercel project.');
  console.log('\n 🖇️  Please note that these steps require manual configuration in the Supabase interface.\n');

  await continueOnAnyKeypress('🖇️  When you are ready to be redirected to the supabase page press any key');

  execSync(`open https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`);

  const { isGHandVercelSetupOnSupabaseReady } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isGHandVercelSetupOnSupabaseReady',
      message: '🖇️  Have you completed the GitHub and Vercel integration setup?',
      default: false,
    },
  ]);

  if (isGHandVercelSetupOnSupabaseReady) {
    console.log('🖇️  Great! Proceeding with the next steps...');
  } else {
    console.log("🖇️  No problem. Please complete the integration when you're ready.");
    console.log(
      `🖇️  You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`,
    );
    console.log("🖇️  Run this script again when you're ready to proceed.");
  }

  process.chdir('..');
};
