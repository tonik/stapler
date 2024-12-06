import fs from 'fs';
import path from 'path';
import { logger } from '../../../../utils/logger';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export const removeTurboFlag = async () => {
  await logger.withSpinner('payload', 'Removing --turbo flag from dev script...', async (spinner) => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');

    try {
      // Read the package.json file
      const data = await readFileAsync(packageJsonPath, 'utf8');

      // Parse the JSON data
      const packageJson = JSON.parse(data);

      // Remove '--turbo' flag from the "dev" script
      if (packageJson.scripts && packageJson.scripts.dev) {
        packageJson.scripts.dev = packageJson.scripts.dev.replace('--turbopack', '').trim();
      }

      // Write the updated package.json back to the file
      await writeFileAsync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      spinner.succeed('Removed --turbo flag from dev script.');
    } catch (err) {
      spinner.fail('Failed to remove --turbo flag from dev script');
      console.error('Error:', err);
    }
  });
};
