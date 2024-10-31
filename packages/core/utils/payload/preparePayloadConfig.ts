import type { PathLike } from 'fs';
import fs from 'fs/promises';
import { getLogColor } from '../shared/getLogColor';

export const preparePayloadConfig = async (configPath: PathLike) => {
  getLogColor('payload', 'Preparing payload.config.ts...');

  try {
    // Read the payload.config.ts file
    const data = await fs.readFile(configPath, 'utf8');

    // Use regex to find the "pool" object and append "schemaName: 'payload'" to the pool configuration
    const updatedConfig = data.replace(/pool:\s*{([^}]*)connectionString[^}]*}/, (match, group1) => {
      if (match.includes('schemaName')) {
        return match; // If "schemaName" already exists, return the match unchanged
      }
      // Append schemaName to the existing pool configuration (avoiding the extra comma)
      return match.replace(group1.trimEnd(), `${group1.trimEnd()} schemaName: 'payload',\n`);
    });

    // Write the updated payload.config.ts back to the file
    await fs.writeFile(configPath, updatedConfig);
  } catch (err) {
    console.error('Error during processing payload.config.ts', err);
  }
};
