import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { templateGenerator } from "./utils/generator/generator";
import { supabaseFiles } from "./templates/supabase/installConfig";
import { preparePayload } from "./utils/generator/payload";
interface ProjectOptions {
  name: string;
  template: `create-turbo` | `create-t3-app`;
  useInngest: boolean;
}

// pnpm dlx create-t3-app@latest ${name} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres

export async function createProject(options: ProjectOptions) {
  const { name, useInngest, template } = options;

  createEnvFile();
  console.log("Creating your Stapler...");
  if (template === "create-t3-app") {
    execSync(
      `pnpm dlx create-t3-app@latest ${name} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres`,
      {
        stdio: "inherit",
      }
    );
  }
  if (template === "create-turbo") {
    execSync(`pnpm dlx create-turbo@latest ${name}`, {
      stdio: "inherit",
    });
  }
  process.chdir(name);

  preparePayload(template);

  // console.log("Installing supabase-js...");
  // execSync(`npm install @supabase/supabase-js`, { stdio: 'inherit' });
  // Run Plop for Supabase files
  //  console.log('Adding Supabase Files...');
  //  const projectDirectory = process.cwd();
  //  templateGenerator(supabaseFiles, projectDirectory)

  console.log(`Your Stapled ${name === "." ? "app" : name} is ready!`);
}
