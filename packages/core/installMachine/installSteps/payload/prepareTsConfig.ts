import fs from 'fs';
import path from 'path';
import { logger } from '../../../utils/logger';

export const prepareTsConfig = () => {
  logger.log('payload', 'Preparing tsconfig.json...');

  // Path to your tsconfig.json file
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

  // Read the tsconfig.json file
  fs.readFile(tsconfigPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading tsconfig.json', err);
      return;
    }

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
    fs.writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2), (err) => {
      if (err) {
        console.error('Error writing to tsconfig.json', err);
      }
    });
  });
};
