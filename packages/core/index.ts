import { prepareDrink } from './utils/bar/prepareDrink';
import { createDocFiles } from './utils/docs/create';
import { createEnvFile } from './utils/env/createEnvFile';
import { initializeRepository } from './utils/github/install';
import { preparePayload } from './utils/payload/install';
import { prettify } from './utils/prettier/prettify';
import { connectSupabaseProject } from './utils/supabase/connectProject';
import { createSupabaseProject } from './utils/supabase/createProject';
import { installSupabase } from './utils/supabase/install';
import { createTurboRepo } from './utils/turbo/create';
import { deployVercelProject } from './utils/vercel/deploy';
import { setupAndCreateVercelProject } from './utils/vercel/setupAndCreate';

interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🖇️  Stapling ${name}...`);

  await createTurboRepo(name);

  process.chdir(name);
  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) await preparePayload();

  await installSupabase(currentDir);

  createDocFiles();

  await prettify();

  await initializeRepository({
    projectName: name,
    visibility: 'private',
  });

  await createSupabaseProject(name);

  await setupAndCreateVercelProject();

  await connectSupabaseProject(name, currentDir);

  await deployVercelProject();

  prepareDrink(name);
}
