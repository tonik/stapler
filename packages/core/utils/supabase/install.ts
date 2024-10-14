import { execSync } from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';

import path from 'path';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';

interface SupabaseProject {
  linked: boolean;
  org_id: string;
  id: string;
  name: string;
  region: string;
  created_at: string;
}
console.log('TEST');
function parseProjectsList(output: string): SupabaseProject[] {
  const lines = output.trim().split('\n');
  lines.splice(0, 2);

  return lines.map((line) => {
    const [linked, org_id, id, name, region, created_at] = line.split('│').map((item) => item.trim());
    return {
      linked: linked !== '',
      org_id,
      id,
      name,
      region,
      created_at,
    };
  });
}

export const installSupabase = async (destinationDirectory: string, name: string) => {
  console.log('🍸 Installing supabase-js...');
  execSync(`supabase init`, { stdio: 'inherit' });

  console.log('🍸 Adding Supabase Files...');
  const templateDirectory = path.join(__dirname, '../templates/supabase/files');

  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
  // add "supabase/**" to pnpm-workspace.yaml
  const workspacePath = path.join(destinationDirectory, 'pnpm-workspace.yaml');
  const addSupabaseToWorkspace = `  - "supabase/**"`;
  fs.appendFileSync(workspacePath, addSupabaseToWorkspace);

  process.chdir('supabase');
  console.log('🍸 Installing Supabase dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  console.log('🍸 Creating Supabase project...');

  execSync(`supabase projects create ${name}`, {
    stdio: 'inherit',
  });

  // Find the newly created project
  const output = execSync('supabase projects list', { encoding: 'utf-8' });
  const projects = parseProjectsList(output);
  const newProject = projects.find((project) => project.name === name);

  console.log('🍸 Linking Supabase project...');
  console.log('\n=== Instructions for Supabase Integration with GitHub and Vercel ===');
  console.log('🍸 1. You will be redirect to your supabase project dashboard');
  console.log('🍸 2. Find the "GitHub" section and click "Connect".');
  console.log('   - Follow the prompts to connect Supabase with your GitHub repository.');
  console.log('🍸 3. Then, find the "Vercel" section and click "Connect".');
  console.log('   - Follow the prompts to connect Supabase with your Vercel project.');
  console.log('\n 🍸 Please note that these steps require manual configuration in the Supabase interface.\n');

  const { isReadyToBeRedirectToWebsite } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isReadyToBeRedirectToWebsite',
      message: '🍸 When you are ready to be redirected to the supabase page press Y',
    },
  ]);

  // check why not working
  await continueOnAnyKeypress('🍸 When you are ready to be redirected to the supabase page press Enter');

  execSync(`open https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`);

  const { isGHandVercelSetupOnSupabaseReady } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isGHandVercelSetupOnSupabaseReady',
      message: '🍸 Have you completed the GitHub and Vercel integration setup?',
      default: false,
    },
  ]);

  if (isGHandVercelSetupOnSupabaseReady) {
    console.log('🍸 Great! Proceeding with the next steps...');
  } else {
    console.log("🍸 No problem. Please complete the integration when you're ready.");
    console.log(
      `🍸 You can access your project dashboard at: https://supabase.com/dashboard/project/${newProject?.id}/settings/integrations`,
    );
    console.log("🍸 Run this script again when you're ready to proceed.");
  }

  process.chdir('..');
};
