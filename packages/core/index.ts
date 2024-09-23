import { execSync } from "child_process";
import { createEnvFile } from "./utils/env/env";
import { templateGenerator } from "./utils/generator/generator";
import { supabaseFiles } from "./templates/supabase/installConfig";
interface ProjectOptions {
  projectName: string;
  useInngest: boolean;
  createTemplate: `t3` | `turbo`;
}

export async function createProject(options: ProjectOptions) {
  const { projectName, useInngest } = options;

  createEnvFile();
  console.log("Creating your Stapler...");
  // Create T3 app
  execSync(`pnpm dlx create-t3-turbo@latest ${projectName}`, {
    stdio: "inherit",
  });
  process.chdir(projectName);
  // update next js to 15 beta and react to react rc
  console.log("Updating Next.js to 15 beta and React to 18 rc...");
  execSync(`pnpm up next@rc react@rc react-dom@rc eslint-config-next@rc`, {
    stdio: "inherit",
  });
  // install payload to next
  console.log("Installing payload to Next.js...");
  // execSync(`npx create-payload-app@beta ${projectName} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres`, { stdio: 'inherit' });
  // make supabase directory and install supabase
  console.log("Installing supabase-js...");
  // execSync(`npm install @supabase/supabase-js`, { stdio: 'inherit' });
  // Run Plop for Supabase files
  //  console.log('Adding Supabase Files...');
  //  const projectDirectory = process.cwd();
  //  templateGenerator(supabaseFiles, projectDirectory)

  console.log(
    `Your Stapled ${projectName !== "." ? projectName : ""} app is ready!`
  );
}
