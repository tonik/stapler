import fs from 'fs/promises';
import { connectWithGH } from './connectWithGH';
import { getDeploymentUrl } from './utils/getDeploymentUrl';
import { getLogColor } from '../shared/getLogColor';

export const deployVercelProject = async () => {
  try {
    await connectWithGH();
  } catch (error: any) {
    getLogColor('vercel', ['An unexpected error occurred:', error, '\nFailed to connect GitHub with Vercel']);
  }

  getLogColor('vercel', 'Creating vercel.json...');

  const vercelConfig = {
    buildCommand: 'pnpm build',
    outputDirectory: 'apps/web',
  };

  await fs.writeFile('vercel.json', JSON.stringify(vercelConfig, null, 2));

  getLogColor('vercel', 'Creating production deployment...');
  const productionUrl = getDeploymentUrl(true);

  getLogColor('vercel', 'Creating preview deployment...');
  const previewUrl = getDeploymentUrl(false);

  getLogColor('vercel', `You can access your preview deployment at: \x1b[36m${previewUrl}\x1b[0m`);

  getLogColor('vercel', `You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m`);
};
