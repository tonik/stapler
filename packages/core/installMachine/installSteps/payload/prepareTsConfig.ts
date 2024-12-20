import fs from 'fs';
import path from 'path';
import { logger } from 'stplr-utils';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export const prepareTsConfig = async () => {
  await logger.withSpinner('Preparing TypeScript config..', async (spinner) => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

    try {
      // Read the tsconfig.json file
      const data = await readFileAsync(tsconfigPath, 'utf8');

      // Parse the JSON data
      const tsconfig = JSON.parse(data);

      // Ensure compilerOptions exists
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }

      // Add the "paths" field to compilerOptions if it doesn't exist
      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
      }

      // Append the "@payload-config" path
      tsconfig.compilerOptions.paths['@payload-config'] = ['./payload.config.ts'];

      // Write the updated tsconfig.json back to the file
      await writeFileAsync(tsconfigPath, JSON.stringify(tsconfig, null, 2));

      spinner.succeed('TypeScript config prepared.');
    } catch (err) {
      spinner.fail('Failed to prepare TypeScript config');
      console.error('Error:', err);
    }
  });
};
