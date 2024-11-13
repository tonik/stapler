import { execSync } from 'child_process';
import { logger } from '../../../utils/logger';

export const createSupabaseProject = async (name: string) => {
  logger.log('supabase', 'Creating Supabase project...');

  execSync(`npx supabase projects create ${name}`, {
    stdio: 'inherit',
  });
};
