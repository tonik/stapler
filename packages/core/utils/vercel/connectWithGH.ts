import { execSync } from 'child_process';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';

const MAX_RETRIES = 3;

export const connectWithGH = async () => {
  console.log('🖇️  Connecting with GitHub repository...');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      execSync('vercel git connect', {
        stdio: ['pipe'],
        encoding: 'utf-8',
      });
      return;
    } catch (error: any) {
      const stderr = error.stderr?.toString() || '';

      const noConnectionError = stderr.match(
        /Error: Failed to link (.*?)\. You need to add a Login Connection to your GitHub account first\. \((\d+)\)/,
      );

      if (noConnectionError) {
        if (attempt === MAX_RETRIES) {
          console.log("\n🖇️  Hmm, we've tried connecting a few times but no luck.");
          console.log("\n🖇️  Let's try to set this up manually:");
          console.log('🖇️  1️⃣  Visit \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m');
          console.log('🖇️  2️⃣  Click on "GitHub" and complete the authorization');
          console.log('🖇️  3️⃣  Once done, run \x1b[36mcvercel git connect\x1b\n');
        } else {
          console.log(`\n🖇️  🔄 Attempt ${attempt} of ${MAX_RETRIES}`);
          console.log("\n🖇️  It seems you haven't connected your GitHub login with Vercel yet. 🤔");
          console.log(
            '🖇️  No worries though! Just head over to \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m$',
          );
          console.log('🖇️  and click that "GitHub" button.');
        }

        await continueOnAnyKeypress("🖇️  Once you've done that press any key");
      }
    }
  }
};
