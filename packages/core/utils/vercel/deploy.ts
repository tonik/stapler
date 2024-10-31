import fs from 'fs/promises';
import chalk from 'chalk';
import { connectWithGH } from './connectWithGH';
import { getDeploymentUrl } from './utils/getDeploymentUrl';

export const deployVercelProject = async () => {
  try {
    await connectWithGH();
  } catch (error) {
    console.log(
      chalk.bgBlack.hex('#FFF')('▲ An unexpected error occurred:', error, '\n▲ Failed to connect GitHub with Vercel'),
    );
  }

  console.log(chalk.bgBlack.hex('#FFF')('▲ Creating vercel.json...'));

  const vercelConfig = {
    buildCommand: 'pnpm build',
    outputDirectory: 'apps/web',
  };

  await fs.writeFile('vercel.json', JSON.stringify(vercelConfig, null, 2));

  console.log(chalk.bgBlack.hex('#FFF')('▲ Creating production deployment...'));
  const productionUrl = getDeploymentUrl(true);

  console.log(chalk.bgBlack.hex('#FFF')('▲ Creating preview deployment...'));
  const previewUrl = getDeploymentUrl(false);

  console.log(chalk.bgBlack.hex('#FFF')(`▲ You can access your preview deployment at: \x1b[36m${previewUrl}\x1b[0m`));

  console.log(
    chalk.bgBlack.hex('#FFF')(`▲ You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m`),
  );
};
