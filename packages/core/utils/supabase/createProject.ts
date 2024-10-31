import { execSync } from 'child_process';
import gradient from 'gradient-string';

const supabaseGradient = gradient([
  { color: '#3ABC82', pos: 0 },
  { color: '#259764', pos: 1 },
]);

export const createSupabaseProject = async (name: string) => {
  console.log(supabaseGradient('Creating Supabase project...'));

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
