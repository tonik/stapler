import { execSync } from 'child_process';
import { getDeploymentUrl } from './utils/getDeploymentUrl';

const fs = require('fs').promises;

export async function deployVercelProject() {
  console.log('🖇️  Connecting to Git repository...');

  execSync('vercel git connect', { stdio: 'inherit' });
  // next step: when error git connect then need to add gh account to your vercel account

  console.log('🖇️  Creating vercel.json...');

  const vercelConfig = {
    buildCommand: 'pnpm build',
    outputDirectory: 'apps/web',
  };

  await fs.writeFile('vercel.json', JSON.stringify(vercelConfig, null, 2));

  console.log('🖇️  Creating preview deployment...');
  const previewUrl = getDeploymentUrl(false);

  console.log('🖇️  Creating production deployment...');
  const productionUrl = getDeploymentUrl(true);

  console.log(`🖇️  You can access your preview deployment at: \x1b[36m${previewUrl}\x1b[0m$`);

  console.log(`🖇️  You can access your production deployment at: \x1b[36m${productionUrl}\x1b[0m$`);
}
