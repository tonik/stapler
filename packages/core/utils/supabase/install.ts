import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';
import { getTemplateDirectory } from '../shared/getTemplateDirectory';

const supabaseLogin = () => {
  console.log('🖇️  Logging into Supabase...');

  try {
    execSync('npx supabase projects list', { stdio: 'ignore' });
    console.log('🖇️  Already logged into Supabase. Skipping login.');
    return;
  } catch (error) {
    try {
      execSync('npx supabase login', { stdio: 'inherit' });
    } catch {
      console.error('\n🖇️  Failed to log in to Supabase.');
      console.log('\n🖇️  Please log in manually with "supabase login" and re-run "create-stapler-app".');
      process.exit(1);
    }
  }
};

const initializeSupabaseProject = (): void => {
  console.log('🖇️  Initialize Supabase project...');
  try {
    execSync(`npx supabase init`, { stdio: ['pipe'], encoding: 'utf-8' });
  } catch (error: any) {
    const errorMessage = error.stderr;

    if (errorMessage.includes('file exists')) {
      console.log('\n🖇️  Supabase configuration file already exists. Skipping re-initialization.');
      return;
    } else {
      console.error('\n🖇️  Failed to initialize Supabase project with "supabase init".');
      console.log(
        '\n🖇️  Please review the error message below, follow the initialization instructions, and try running "create-stapler-app" again.',
      );
      process.exit(1);
    }
  }
};

export const installSupabase = async (destinationDirectory: string) => {
  console.log('🖇️  Installing supabase-js...');
  try {
    supabaseLogin();
    initializeSupabaseProject();
  } catch (error) {
    console.error('\n🖇️  Failed to init Supabase project.');
    console.error(`🖇️  Error: ${error}`);
    process.exit(1);
  }

  console.log('🖇️  Adding Supabase Files...');

  const templateDirectory = getTemplateDirectory(`/templates/supabase/files/`);

  templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);
  // add "supabase/**" to pnpm-workspace.yaml
  const workspacePath = path.join(destinationDirectory, 'pnpm-workspace.yaml');
  const addSupabaseToWorkspace = `  - "supabase/**"`;
  // check if the file already contains the line
  const fileContents = fs.readFileSync(workspacePath, 'utf-8');

  if (!fileContents.includes(addSupabaseToWorkspace)) {
    // append only if the line doesn't already exist
    fs.appendFileSync(workspacePath, `${addSupabaseToWorkspace}\n`);
  }

  process.chdir('supabase');

  console.log('🖇️  Installing Supabase dependencies...');

  execSync('pnpm install', { stdio: 'inherit' });

  process.chdir('..');
};
