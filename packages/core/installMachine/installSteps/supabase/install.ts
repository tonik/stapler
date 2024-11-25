import { loginToSupabase } from './loginToSupabase';
import { initializeSupabaseProject } from './initializeSupabaseProject';
import { addTemplateFiles } from './addTemplateFiles';
import { installDependencies } from './installDependencies';
import { startLocalDatabase } from './startLocalDatabase';
import { createEnvFile } from './createEnvFile';

export const installSupabase = async (destinationDirectory: string) => {
  await loginToSupabase();
  await initializeSupabaseProject();
  await addTemplateFiles(destinationDirectory);

  process.chdir('supabase');

  await installDependencies();
  await startLocalDatabase();
  await createEnvFile();

  process.chdir('..');
};
