import { execSync } from 'child_process';
import { createEnvFile } from './utils/env';

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
  execSync(`dlx create-payload-app@beta`)
  process.chdir('../../..');
  execSync(`pnpm install @supabase/supabase-js`, { stdio: 'inherit' });

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