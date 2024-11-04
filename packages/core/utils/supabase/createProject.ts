import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../shared/logWithColoredPrefix';

export const createSupabaseProject = async (name: string) => {
  logWithColoredPrefix('supabase', 'Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
