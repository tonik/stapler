import { execSync } from 'child_process';

export async function setupAndCreateVercelProject() {
  console.log('🖇️  Checking if Vercel CLI is installed...');

  const isVercelInstalled = execSync('vercel --version', { encoding: 'utf8' });

  if (!isVercelInstalled) {
    console.log('🖇️  Installing Vercel CLI...');
    execSync('npm install -g vercel');
  }

  const isLoggedInToVercel = execSync('vercel whoami', { stdio: 'pipe', encoding: 'utf-8' });

  if (!isLoggedInToVercel) {
    console.log('🖇️  Logging in to Vercel...');
    execSync('vercel login');
  } else {
    console.log(`🖇️  You are logged to Vercel as \x1b[36m${isLoggedInToVercel}\x1b[0m`);
  }

  console.log('🖇️  Initializing Vercel project...');
  execSync('vercel init');

  console.log('🖇️  Linking Vercel project...');
  execSync('vercel link', { stdio: 'inherit' });
}
