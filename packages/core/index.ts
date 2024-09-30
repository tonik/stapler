import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { preparePayload } from "./utils/payload/install";
import { installSupabase } from "./utils/supabase/install";
import { prettify } from "./utils/prettier/prettify";

interface ProjectOptions {
  name: string;
  usePayload: boolean;
  useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  createEnvFile();
  console.log("🍸 Creating your Stapler...");

  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: "inherit",
  });

  process.chdir(name);

  if (usePayload) preparePayload();

  const currentDir = process.cwd();
  installSupabase(currentDir);

  prettify();

  console.log(`🍸 Your Stapled ${name === "." ? "app" : name} is ready!`);
}
