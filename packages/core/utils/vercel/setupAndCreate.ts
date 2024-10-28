import { execSync } from 'child_process';

const vercelVersion = (): boolean => {
  try {
    execSync('vercel --version', { encoding: 'utf8' });
    return true;
  } catch {
    return false;
  }
};

const getUserName = (): string | null => {
  try {
    const user = execSync('vercel whoami', { stdio: 'pipe', encoding: 'utf-8' });
    console.log('test', user);
    return user;
  } catch {
    return null;
  }
};

export const setupAndCreateVercelProject = async () => {
  console.log('🖇️  Checking if Vercel CLI is installed...');

  const isVercelInstalled = vercelVersion();

  if (!isVercelInstalled) {
    console.log('🖇️  Installing Vercel CLI...');
    try {
      execSync('npm install -g vercel');
    } catch {
      console.error('🖇️  Failed to install Vercel CLI...');
      process.exit(1);
    }
  }

  const vercelUserName = getUserName();

  if (!vercelUserName) {
    console.log('🖇️  Logging in to Vercel...');
    try {
      execSync('vercel login', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n🖇️  Oops! Something went wrong while logging in to Vercel...');
      console.log('🖇️  You might already be logged in with this email in another project.');
      console.log(
        '🖇️  In this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
      );
      try {
        execSync('vercel login', { stdio: 'inherit' });
      } catch {
        console.log('\n🖇️  Please check the error above and try again.');
        console.log('🖇️  After successfully logging in with "vercel login", please run create-stapler-app again.\n');
        process.exit(1);
      }
    }
  } else {
    console.log(`🖇️  You are logged to Vercel as \x1b[36m${vercelUserName}\x1b[0m`);
  }

  console.log('🖇️  Initializing Vercel project...');
  execSync('vercel init');

  console.log('🖇️  Linking Vercel project...');
  execSync('vercel link', { stdio: 'inherit' });
};
