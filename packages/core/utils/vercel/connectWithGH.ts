import { execSync } from 'child_process';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';
import { getLogColor } from '../shared/getLogColor';

const MAX_RETRIES = 3;

export const connectWithGH = async () => {
  getLogColor('vercel', 'Connecting with GitHub repository...');

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      execSync('npx vercel git connect', {
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
          getLogColor('vercel', [
            "Hmm, we've tried connecting a few times but no luck.",
            "\n\n Let's try to set this up manually:",
            '\n 1️⃣  Visit \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m',
            '\n 2️⃣  Click on "GitHub" and complete the authorization',
            '\n 3️⃣  Once done, run \x1b[36mcvercel git connect\x1b\n',
          ]);
        } else {
          getLogColor('vercel', [
            `🔄 Attempt ${attempt} of ${MAX_RETRIES}`,
            "\n\nIt seems you haven't connected your GitHub login with Vercel yet. 🤔",
            '\nNo worries though! Just head over to \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m$',
            '\nand click that "GitHub" button.',
          ]);
        }

        await continueOnAnyKeypress("Once you've done that press any key");
      }
    }
  }
};
