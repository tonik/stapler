import { execSync } from 'child_process';

export function deployProject() {
  console.log('🖇️  Deploying project to Vercel...');
  execSync('vercel deploy');
}
