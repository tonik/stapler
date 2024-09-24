import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { preparePayload } from "./utils/payload/install";
import { installSupabase } from "./utils/supabase/install";
interface ProjectOptions {
  name: string;
  useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { name } = options;

  createEnvFile();
  console.log("🍸 Creating your Stapler...");

  execSync(`pnpm dlx create-turbo@latest ${name}`, {
    stdio: "inherit",
  });

  process.chdir(name);

  preparePayload();
  installSupabase();

  console.log(`🍸 Your Stapled ${name === "." ? "app" : name} is ready!`);
}
