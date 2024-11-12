import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { supabaseFiles } from '../../../templates/supabase/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

const supabaseLogin = () => {
  logWithColoredPrefix('supabase', 'Logging in...');

  try {
    execSync('npx supabase projects list', { stdio: 'ignore' });
    logWithColoredPrefix('supabase', 'Already logged in.');
    return;
  } catch (error) {
    try {
      execSync('npx supabase login', { stdio: 'inherit' });
    } catch {
      console.error('Failed to log in to Supabase.');
      logWithColoredPrefix(
        'supabase',
        '\nPlease log in manually with "supabase login" and re-run "create-stapler-app".',
      );
      process.exit(1);
    }
  }
};

const initializeSupabaseProject = (): void => {
  logWithColoredPrefix('supabase', 'Initialize project...');
  try {
    execSync(`npx supabase init`, { stdio: ['pipe'], encoding: 'utf-8' });
  } catch (error: any) {
    const errorMessage = error.stderr;

    if (errorMessage.includes('file exists')) {
      logWithColoredPrefix('supabase', 'Configuration file already exists.');
      return;
    } else {
      console.error('Failed to initialize Supabase project with "supabase init".');
      logWithColoredPrefix(
        'supabase',
        '\nPlease review the error message below, follow the initialization instructions, and try running "create-stapler-app" again.',
      ),
        process.exit(1);
    }
  }
};

export const installSupabase = async (destinationDirectory: string) => {
  logWithColoredPrefix('supabase', 'Installing supabase-js...');
  try {
    supabaseLogin();
    initializeSupabaseProject();
  } catch (error) {
    console.error('Failed to init project.', `\nError: ${error}`);
    process.exit(1);
  }

  logWithColoredPrefix('supabase', 'Adding Files...');

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

  logWithColoredPrefix('supabase', 'Installing dependencies...');

  execSync('pnpm i --reporter silent', { stdio: 'inherit' });

  logWithColoredPrefix('supabase', 'Starting local database...');

  try {
    execSync('npx supabase start', { stdio: 'ignore' });
  } catch (error) {
    console.error(
      `Failed to start local database. Is your ${chalk.hex('#0db7ed')('Docker')} daemon running?`,
      `\n${error}`,
    );
    process.exit(1);
  }

  logWithColoredPrefix('supabase', 'Writing local variables to .env file...');

  const output = execSync('npx supabase status --output json', {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  // Parse the JSON output
  const jsonData = JSON.parse(output);

  // Convert JSON data to .env format
  const envData = Object.entries(jsonData)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Write the formatted data to .env file
  fs.writeFileSync('.env', envData, 'utf8');

  process.chdir('..');
};
