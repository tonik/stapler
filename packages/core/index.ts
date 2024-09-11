import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

interface ProjectOptions {
  projectName: string;
  useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { projectName, useInngest } = options;

  console.log('Creating your awesome app...');

  // Create T3 app
  execSync(`npx create-t3-app@latest ${projectName} --CI --noGit --noInstall --appRouter --trpc --drizzle --nextAuth false --tailwind --dbProvider postgres`, { stdio: 'inherit' });

  if (useInngest) {
    console.log('Adding Inngest...');
    process.chdir(projectName);
    execSync('npm install inngest', { stdio: 'inherit' });
    
    // Add Inngest setup code
    const inngestSetup = `
import { Inngest } from 'inngest';

export const inngest = new Inngest({ name: 'My App' });
    `;
    fs.writeFileSync(path.join(process.cwd(), 'src', 'inngest.ts'), inngestSetup);
  }

  console.log('Your awesome app is ready!');
}