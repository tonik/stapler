import { createTurboRepo } from './utils/turbo/create';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { prepareDrink } from './utils/bar/prepareDrink';
import { initializeRepository } from './utils/github/install';

interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🖇️ Stapling ${name}...`);

  await createTurboRepo(name);

  process.chdir(name);

  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) await preparePayload();

  await installSupabase(currentDir);

  await prettify();

  initializeRepository({
    projectName: name,
    visibility: 'private',
  });

  prepareDrink(name);
}
