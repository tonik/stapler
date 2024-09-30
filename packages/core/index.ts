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

  console.log("🍸 Creating your Stapler...");
  console.log("%cred", "color: red", "Stapler is still in beta");
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: "inherit",
  });

  process.chdir(name);

  const currentDir = process.cwd();

  createEnvFile(currentDir);

  if (usePayload) preparePayload();

  installSupabase(currentDir);

  prettify();

  console.log(`🍸 Your Stapled ${getName(name)} is ready!`);
  console.log(`🍸 You can now run: cd ${name} && pnpm dev`);
}
