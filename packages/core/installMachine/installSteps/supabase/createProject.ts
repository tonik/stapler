import { execSync } from 'child_process';
import { logger } from 'stplr-utils';

export const createSupabaseProject = async (name: string) => {
  logger.log('Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
