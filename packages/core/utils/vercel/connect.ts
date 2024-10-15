import { execSync } from 'child_process';

export function connectToGit() {
  console.log('🖇️  Connecting to Git repository...');
  execSync('vercel git connect');
}
