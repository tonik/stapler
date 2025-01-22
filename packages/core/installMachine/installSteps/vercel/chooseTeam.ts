import boxen, { Options } from 'boxen';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { BOXEN_SETTINGS } from 'stplr-utils';

export const chooseVercelTeam = async () => {
  console.log(
    boxen(
      chalk.bold('Choose a Vercel team to link your project to.\n\n') +
        'If you are not sure, you can skip this step by choosing "Cancel". This will link the project to the current logged-in user.',
      BOXEN_SETTINGS as Options,
    ),
  );

  execSync('npx vercel teams switch', { stdio: 'inherit' });
};
