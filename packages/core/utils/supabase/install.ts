import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';

const checkAndInstallSupabaseCLI = (): void => {
  console.log('🖇️  Checking Supabase CLI installation...');

  try {
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('🖇️  Installing Supabase CLI...');
    try {
      // For macOS/Linux using Homebrew
      if (process.platform === 'darwin' || process.platform === 'linux') {
        execSync('brew install supabase/tap/supabase', { stdio: 'inherit' });
      }
      // For Windows using npm
      else if (process.platform === 'win32') {
        execSync('npm install -g supabase', { stdio: 'inherit' });
      } else {
        throw new Error('Unsupported operating system');
      }
    } catch (installError) {
      console.error('\n🖇️  Failed to install Supabase CLI automatically. Please install it manually:');
      console.log('\n🖇️  MacOS/Linux:');
      console.log('🖇️  brew install supabase/tap/supabase');
      console.log('\n🖇️  Windows:');
      console.log('🖇️  npm install -g supabase');
      console.log('\n🖇️  For other installation methods, visit:');
      console.log('🖇️  https://supabase.com/docs/guides/local-development/cli/getting-started \n');
      process.exit(1);
    }
  }
};

const supabaseLogin = () => {
  console.log('🖇️  Logging into Supabase...');

  try {
    execSync('supabase projects list', { stdio: 'ignore' });
    console.log('🖇️  Already logged into Supabase. Skipping login.');
    return;
  } catch (error) {
    try {
      execSync('supabase login', { stdio: 'inherit' });
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
    execSync(`supabase init`, { stdio: ['pipe'], encoding: 'utf-8' });
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
    checkAndInstallSupabaseCLI();
    supabaseLogin();
    initializeSupabaseProject();
  } catch (error) {
    console.error('\n🖇️  Failed to init Supabase project.');
    console.error(`🖇️  Error: ${error}`);
    process.exit(1);
  }

  console.log('🖇️  Adding Supabase Files...');

  const templateDirectory = path.join(__dirname, '../templates/supabase/files');

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
