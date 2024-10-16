import { execSync } from 'child_process';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { prepareDrink } from './utils/bar/prepareDrink';
import { initializeRepository } from './utils/github/install';
import { createAndConnectSupabaseProject } from './utils/supabase';

interface ProjectOptions {
  name: string;
  usePayload: boolean;
  // useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🖇️ Stapling ${name}...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });

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

  await createAndConnectSupabaseProject(name);

  prepareDrink(name);
}
