import { addTemplateFiles } from './addTemplateFiles';
import { createEnvFile } from './createEnvFile';
import { initializeSupabaseProject } from './initializeSupabaseProject';
import { installDependencies } from './installDependencies';

export const installSupabase = async (destinationDirectory: string) => {
  await initializeSupabaseProject();
  await addTemplateFiles(destinationDirectory);

  process.chdir('supabase');

  await installDependencies();
  await createEnvFile();

  process.chdir('..');
};
