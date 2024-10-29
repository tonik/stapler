import { execSync } from 'child_process';

export const createSupabaseProject = async (name: string) => {
  console.log('🖇️  Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
