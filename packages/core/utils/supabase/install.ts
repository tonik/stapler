import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';

function checkAndInstallSupabaseCLI(): void {
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
}

export const installSupabase = async (destinationDirectory: string) => {
  console.log('🖇️  Installing supabase-js...');
  try {
    checkAndInstallSupabaseCLI();
    execSync(`supabase init`, { stdio: 'inherit' });
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
  fs.appendFileSync(workspacePath, addSupabaseToWorkspace);

  process.chdir('supabase');

  console.log('🖇️  Installing Supabase dependencies...');

  execSync('pnpm install', { stdio: 'inherit' });

  process.chdir('..');
};
