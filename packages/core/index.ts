import { createTurboRepo } from './utils/turbo/create';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { prepareDrink } from './utils/bar/prepareDrink';
import { initializeRepository } from './utils/github/install';
import { connectSupabaseProject } from './utils/supabase/connectProject';
import { createSupabaseProject } from './utils/supabase/createProject';

interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;
  const currentDir = process.cwd();

  console.log(`🖇️ Stapling ${name}...`);

  await createTurboRepo(name);

  process.chdir(name);

  createEnvFile(currentDir);

  if (usePayload) await preparePayload();

  installSupabase(currentDir);

  await prettify();

  await initializeRepository({
    projectName: name,
    visibility: 'private',
  });

  await createSupabaseProject(name);

  await connectSupabaseProject(name, currentDir);

  prepareDrink(name);
}
