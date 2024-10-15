import { execSync } from 'child_process';

function isVercelInstalled() {
  console.log('🖇️  Checking if Vercel CLI is installed...');

  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

export function installVercel() {
  if (isVercelInstalled()) {
    console.log('🖇️  Vercel CLI is already installed.');
    return;
  }
  console.log('🖇️  Installing Vercel CLI...');

  execSync('npm install -g vercel');
}
