import { execSync } from 'child_process';
import { getLogColor } from '../shared/getLogColor';

export const createSupabaseProject = async (name: string) => {
  getLogColor('supabase', 'Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
