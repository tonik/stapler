import { execSync } from 'child_process';
import { createEnvFile } from './utils/env';
import fs from 'fs';
import path from 'path';

const addSupabaseToWorkspace = (): void => {
  const workspaceFilePath: string = path.join(process.cwd(), 'pnpm-workspace.yaml');

  // Check if the pnpm-workspace.yaml file exists
  if (!fs.existsSync(workspaceFilePath)) {
    console.error('Error: pnpm-workspace.yaml not found!');
    return;
  }

  // Read the content of the pnpm-workspace.yaml file
  const workspaceContent: string = fs.readFileSync(workspaceFilePath, 'utf-8');

  // Check if 'packages/supabase/*' is already in the workspace file
  if (workspaceContent.includes('packages/supabase/*')) {
    console.log('Supabase already exists in pnpm-workspace.yaml');
    return;
  }

  // Modify the workspace file content by appending the 'packages/supabase/*' line
  const updatedContent: string = workspaceContent.replace(/packages:\s*\[[^\]]+\]/, (match: string) => {
    const updatedPackages: string = match.replace(/\]$/, `  - 'packages/supabase/*'\n]`);
    return updatedPackages;
  });

  // Write the updated content back to the pnpm-workspace.yaml file
  fs.writeFileSync(workspaceFilePath, updatedContent, 'utf-8');
  console.log('Added packages/supabase/* to pnpm-workspace.yaml');
}

interface ProjectOptions {
  projectName: string;
  useInngest: boolean;
}

export async function createProject(options: ProjectOptions) {
  const { projectName, useInngest } = options;

  createEnvFile();  
  console.log('Creating your tonik-infused app...');
  // Create T3 app
  execSync(`npx create-turbo@latest ${projectName}`, { stdio: 'inherit' });
  process.chdir(projectName);
  process.chdir('apps');
  process.chdir('web');
  execSync(`pnpm up next@15.0.0-canary.156 react@rc react-dom@rc eslint-config-next@rc`, { stdio: 'inherit' });
  execSync(`pnpm dlx create-payload-app@beta`)
  process.chdir('../..');
  // make supabase directory and install supabase
  console.log('Adding Supabase...');
  addSupabaseToWorkspace()
  execSync(`mkdir supabase && cd supabase && pnpm init -y`, { stdio: 'inherit' });
  console.log('Installing supabase-js...');
   execSync(`pnpm add @supabase/supabase-js`, { stdio: 'inherit' });

  if (useInngest) {
    console.log('Adding Inngest...');
//     process.chdir(projectName);
//     execSync('npm install inngest', { stdio: 'inherit' });
    
//     // Add Inngest setup code
//     const inngestSetup = `
// import { Inngest } from 'inngest';

// export const inngest = new Inngest({ name: 'My App' });
//     `;
//     fs.writeFileSync(path.join(process.cwd(), 'src', 'inngest.ts'), inngestSetup);
    }


  console.log('Your tonik-infused app is ready!');
}