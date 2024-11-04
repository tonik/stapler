import fs from 'fs/promises';
import { execSync } from 'node:child_process';
import { connectWithGH } from './connectWithGH';
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

  const productionUrl = execSync('vercel --prod', {
    stdio: ['inherit', 'pipe', 'inherit'],
    encoding: 'utf8',
  });

  if (productionUrl) {
    getLogColor('vercel', `You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m`);
  } else {
    getLogColor('vercel', 'Failed to create production deployment.');
    return;
  }
};
