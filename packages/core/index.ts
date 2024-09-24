import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { preparePayload } from "./utils/payload";
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

  // console.log("🍸 Installing supabase-js...");
  // execSync(`npm install @supabase/supabase-js`, { stdio: 'inherit' });
  // Run Plop for Supabase files
  //  console.log('🍸 Adding Supabase Files...');
  //  const projectDirectory = process.cwd();
  //  templateGenerator(supabaseFiles, projectDirectory)

  console.log(`🍸 Your Stapled ${name === "." ? "app" : name} is ready!`);
}
