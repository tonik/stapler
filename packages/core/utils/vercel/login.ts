import { execSync } from 'child_process';

function isLoggedInToVercel() {
  try {
    const output = execSync('vercel whoami', { stdio: 'pipe', encoding: 'utf-8' });
    console.log(`🖇️  You are logged to Vercel as ${output}`);
    return !output.toLowerCase().includes('error');
  } catch (error) {
    return false;
  }
}

export function loginToVercel() {
  if (isLoggedInToVercel()) {
    return;
  }
  console.log('🖇️  Logging in to Vercel...');
  execSync('vercel login');
}
