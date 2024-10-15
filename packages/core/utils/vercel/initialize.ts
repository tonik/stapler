import { execSync } from 'child_process';

export function initializeVercelProject() {
  console.log('🖇️  Initializing Vercel project...');
  execSync('vercel init');
}
