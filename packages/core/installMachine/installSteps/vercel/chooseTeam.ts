import { execSync } from 'child_process';
import boxen from 'boxen';
import chalk from 'chalk';

export const chooseVercelTeam = async () => {
  console.log(
    boxen(
      chalk.bold('Choose a Vercel team to link your project to.\n\n') +
        'If you are not sure, you can skip this step by choosing "Cancel". This will link the project to the current logged-in user.',
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: '#FFFFFF',
      },
    ),
  );

  execSync('npx vercel teams switch', { stdio: 'inherit' });
};
