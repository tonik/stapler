import { execSync } from 'child_process';

export const createSupabaseProject = async (name: string) => {
  console.log('🖇️  Creating Supabase project...');

  execSync(`supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
