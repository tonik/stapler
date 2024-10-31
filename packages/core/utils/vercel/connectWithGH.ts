import { execSync } from 'child_process';
import chalk from 'chalk';
import { continueOnAnyKeypress } from '../shared/continueOnKeypress';

const MAX_RETRIES = 3;

export const connectWithGH = async () => {
  console.log(chalk.bgBlack.hex('#FFF')('▲ Connecting with GitHub repository...'));

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
          console.log(
            chalk.bgBlack.hex('#FFF')(
              "▲ Hmm, we've tried connecting a few times but no luck.",
              "\n\n ▲ Let's try to set this up manually:",
              '\n ▲ 1️⃣  Visit \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m',
              '\n ▲ 2️⃣  Click on "GitHub" and complete the authorization',
              '\n ▲ 3️⃣  Once done, run \x1b[36mcvercel git connect\x1b\n',
            ),
          );
        } else {
          console.log(
            chalk.bgBlack.hex('#FFF')(
              `▲ 🔄 Attempt ${attempt} of ${MAX_RETRIES}`,
              "\n\n▲ It seems you haven't connected your GitHub login with Vercel yet. 🤔",
              '\n▲ No worries though! Just head over to \x1b[36mhttps://vercel.com/account/login-connections\x1b[0m$',
              '\n▲ and click that "GitHub" button.',
            ),
          );
        }

        await continueOnAnyKeypress("▲ Once you've done that press any key");
      }
    }
  }
};
