import { execSync } from 'child_process';

export const createSupabaseProject = (name: string) => {
  console.log('🖇️  Creating Supabase project...');

  execSync(`supabase projects create ${name}`, {
    stdio: 'inherit',
  });

  console.log('🖇️  Supabase project created successfully!');
};
