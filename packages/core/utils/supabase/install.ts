import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { supabaseFiles } from '../../templates/supabase/installConfig';
import { templateGenerator } from '../generator/generator';

export const installSupabase = async (destinationDirectory: string) => {
  console.log('🖇️  Installing supabase-js...');
  execSync(`supabase init`, { stdio: 'inherit' });

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
};
