import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../../../utils/logger';

export const updatePackageJson = async () => {
  const packageJsonPath = path.resolve('package.json');
  logger.withSpinner('payload', 'Updating package.json...', async (spinner) => {
    try {
      // Read and parse package.json
      const packageData = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));

      // Add db script to package.json
      packageData.scripts = {
        ...packageData.scripts,
        'db:migrate': 'npx payload migrate',
      };

      // Payload doesn't work with Turbopack yet
      // Remove '--turbo' flag from the "dev" script
      if (packageData.scripts && packageData.scripts.dev) {
        packageData.scripts.dev = packageData.scripts.dev.replace('--turbo', '').trim();
      }

      // Write the modified package.json
      await fs.writeFile(packageJsonPath, JSON.stringify(packageData, null, 2));
      spinner.succeed('Updated package.json');
    } catch (error) {
      spinner.fail('Failed to update package.json');
      console.error('Error updating files:', error);
    }
  });
};
