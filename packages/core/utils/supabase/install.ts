import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';
import { getTemplateDirectory } from '../shared/getTemplateDirectory';

const supabaseGradient = gradient([
  { color: '#3ABC82', pos: 0 },
  { color: '#259764', pos: 1 },
]);

const supabaseLogin = () => {
  console.log(supabaseGradient('Logging into Supabase...'));

  try {
    execSync('npx supabase projects list', { stdio: 'ignore' });
    console.log(supabaseGradient('Already logged into Supabase.'));
    return;
  } catch (error) {
    try {
      execSync('npx supabase login', { stdio: 'inherit' });
    } catch {
      console.error('Failed to log in to Supabase.');
      console.log(supabaseGradient('\nPlease log in manually with "supabase login" and re-run "create-stapler-app".'));
      process.exit(1);
    }
  }
};

const initializeSupabaseProject = (): void => {
  console.log(supabaseGradient('Initialize Supabase project...'));
  try {
    execSync(`npx supabase init`, { stdio: ['pipe'], encoding: 'utf-8' });
  } catch (error: any) {
    const errorMessage = error.stderr;

    if (errorMessage.includes('file exists')) {
      console.log(supabaseGradient('Supabase configuration file already exists.'));
      return;
    } else {
      console.error('Failed to initialize Supabase project with "supabase init".');
      console.log(
        supabaseGradient(
          '\nPlease review the error message below, follow the initialization instructions, and try running "create-stapler-app" again.',
        ),
      );
      process.exit(1);
    }
  }
};

export const installSupabase = async (destinationDirectory: string) => {
  console.log(supabaseGradient('Installing supabase-js...'));
  try {
    supabaseLogin();
    initializeSupabaseProject();
  } catch (error) {
    console.error('Failed to init Supabase project.', `\nError: ${error}`);
    process.exit(1);
  }

  console.log(supabaseGradient('Adding Supabase Files...'));

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

  console.log(supabaseGradient('Installing Supabase dependencies...'));

  execSync('pnpm i --reporter silent', { stdio: 'inherit' });

  process.chdir('..');
};
