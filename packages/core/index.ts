import { execSync } from 'child_process';
import { prepareDrink } from './utils/bar/prepareDrink';
import { createEnvFile } from './utils/env/createEnvFile';
import { initializeRepository } from './utils/github/install';
import { preparePayload } from './utils/payload/install';
import { prettify } from './utils/prettier/prettify';
import { installSupabase } from './utils/supabase/install';
import { setupVercel } from './utils/vercel';

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

  await installSupabase(currentDir);

  await prettify();

  initializeRepository({
    projectName: name,
    visibility: 'private',
  });

  await setupVercel();

  prepareDrink(name);
}
