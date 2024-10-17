
import { execSync } from 'child_process';
import { prepareDrink } from './utils/bar/prepareDrink';
import { createTurboRepo } from './utils/turbo/create';
import { createEnvFile } from './utils/env/createEnvFile';
import { initializeRepository } from './utils/github/install';
import { preparePayload } from './utils/payload/install';
import { prettify } from './utils/prettier/prettify';
import { installSupabase } from './utils/supabase/install';
import { setupVercel } from './utils/vercel';
import { connectSupabaseProject } from './utils/supabase/connectProject';
import { createSupabaseProject } from './utils/supabase/createProject';


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

  installSupabase(currentDir);

  await prettify();

  await initializeRepository({
    projectName: name,
    visibility: 'private',
  });

  await createSupabaseProject(name);

  await connectSupabaseProject(name, currentDir);

  await setupVercel();

  prepareDrink(name);
}
