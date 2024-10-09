import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/createEnvFile";
import { preparePayload } from "./utils/payload/install";
import { installSupabase } from "./utils/supabase/install";
import { prettify } from "./utils/prettier/prettify";
import { prepareDrink } from "./utils/bar/prepareDrink";

interface ProjectOptions {
  name: string;
  usePayload: boolean;
  // useInngest: boolean;
}

export function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🍸 Stapling ${name}...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: "inherit",
  });

  process.chdir(name);

  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) preparePayload();

  installSupabase(currentDir);

  prettify();

  prepareDrink(name);
}
