import { execSync } from 'child_process';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const createSupabaseProject = async (name: string) => {
  logWithColoredPrefix('supabase', 'Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
