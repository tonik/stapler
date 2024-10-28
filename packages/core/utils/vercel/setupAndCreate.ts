import { execSync } from 'child_process';

const getUserName = (): string | null => {
  try {
    const user = execSync('npx vercel whoami', { stdio: 'pipe', encoding: 'utf-8' });
    return user;
  } catch {
    return null;
  }
};

export const setupAndCreateVercelProject = async () => {
  const vercelUserName = getUserName();

  if (!vercelUserName) {
    console.log('🖇️  Logging in to Vercel...');
    try {
      execSync('npx vercel login', { stdio: 'inherit' });
    } catch (error) {
      console.log('\n🖇️  Oops! Something went wrong while logging in to Vercel...');
      console.log('🖇️  You might already be logged in with this email in another project.');
      console.log(
        '🖇️  In this case, select "Continue with Email" and enter the email you\'re already logged in with.\n',
      );
      try {
        execSync('npx vercel login', { stdio: 'inherit' });
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
  execSync('npx vercel init');

  console.log('🖇️  Linking Vercel project...');
  execSync('npx vercel link', { stdio: 'inherit' });
};
