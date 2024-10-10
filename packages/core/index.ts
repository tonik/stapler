import { execSync } from "child_process";
import { prepareDrink } from "./utils/bar/prepareDrink";
import { createEnvFile } from "./utils/env/createEnvFile";
import { preparePayload } from "./utils/payload/install";
import { prettify } from "./utils/prettier/prettify";
import { installSupabase } from "./utils/supabase/install";

interface ProjectOptions {
  name: string;
  usePayload: boolean;
  // useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🍸 Stapling ${name}...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: "inherit",
  });

  process.chdir(name);

  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) await preparePayload();

  await installSupabase(currentDir, name);

  await prettify();

  prepareDrink(name);
}
