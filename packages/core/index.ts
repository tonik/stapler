import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { templateGenerator } from "./utils/generator/generator";
import { supabaseFiles } from "./templates/supabase/installConfig";
import { preparePayload } from "./utils/generator/payload";
interface ProjectOptions {
  projectName: string;
  useInngest: boolean;
  createTemplate: `create-turbo` | `create-t3-app`;
}

// pnpm dlx create-t3-app@latest ${projectName} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres

export async function createProject(options: ProjectOptions) {
  const { projectName, useInngest, createTemplate } = options;

  createEnvFile();
  console.log("Creating your Stapler...");
  if (createTemplate === "create-t3-app") {
    execSync(
      `pnpm dlx create-t3-app@latest ${projectName} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres`,
      {
        stdio: "inherit",
      }
    );
  }
  if (createTemplate === "create-turbo") {
    execSync(`pnpm dlx create-turbo@latest ${projectName}`, {
      stdio: "inherit",
    });
  }
  console.log("Changing directory...");
  process.chdir(projectName);
  console.log("Done changing directory...?");
  // preparePayload(createTemplate);
  // make supabase directory and install supabase
  // console.log("Installing supabase-js...");
  // execSync(`npm install @supabase/supabase-js`, { stdio: 'inherit' });
  // Run Plop for Supabase files
  //  console.log('Adding Supabase Files...');
  //  const projectDirectory = process.cwd();
  //  templateGenerator(supabaseFiles, projectDirectory)

  console.log(
    `Your Stapled ${projectName !== "." ? projectName : "app"} is ready!`
  );
}
