import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/createEnvFile";
import { preparePayload } from "./utils/payload/install";
import { installSupabase } from "./utils/supabase/install";
import { prettify } from "./utils/prettier/prettify";

interface ProjectOptions {
  name: string;
  usePayload: boolean;
  // useInngest: boolean;
}

const getName = (name: string) => {
  if (!name) {
    return ".";
  }

  return name;
};

export async function createProject(options: ProjectOptions) {
  const { name, usePayload } = options;

  console.log(`🍸 Stapling you ${name} app...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: "inherit",
  });

  process.chdir(name);

  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) preparePayload();

  installSupabase(currentDir);

  prettify();

  console.log("🍸 Filling a high ball glass with ice...");
  console.log("🍸 Add gin and lime juice...");
  console.log("🍸 Topping with Tonik...");
  console.log("🍸 Garnishing with lime wedge...");
  console.log(`🍸 Your Stapled ${getName(name)} is ready!`);

  // I'm too lazy to mess with modules building to allow coloring library to be installed lol
  console.log(`🍸 You can now run:`);
  console.log(`\x1b[36m%s\x1b[0m`, `🍸 cd ${name} && pnpm dev`, `\x1b[0m`);
}
