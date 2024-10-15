import { execSync } from 'child_process';

export function linkVercelProject() {
  console.log('🖇️  Linking Vercel project...');
  execSync('vercel link');
}
