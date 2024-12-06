import { existsSync } from 'fs';
import fs from 'fs/promises';
import { logger } from '../../../../utils/logger';
import { join } from 'path';

export const preparePayloadConfig = async () => {
  // Check if the payload configuration file exists
  const payloadConfigPath = join(process.cwd(), 'payload.config.ts');
  if (!existsSync(payloadConfigPath)) {
    console.error('Payload installation cancelled/failed.');
    return;
  }

  await logger.withSpinner('payload', 'Preparing config...', async (spinner) => {
    try {
      // Read the payload.config.ts file
      const data = await fs.readFile(payloadConfigPath, 'utf8');

      // Use regex to find the "pool" object and append "schemaName: 'payload'" to the pool configuration
      const updatedConfig = data.replace(/pool:\s*{([^}]*)connectionString[^}]*}/, (match, group1) => {
        if (match.includes('schemaName')) {
          return match; // If "schemaName" already exists, return the match unchanged
        }
        // Append schemaName to the existing pool configuration (avoiding the extra comma)
        return match.replace(group1.trimEnd(), `${group1.trimEnd()} schemaName: 'payload',\n`);
      });

      // Write the updated payload.config.ts back to the file
      await fs.writeFile(payloadConfigPath, updatedConfig);

      spinner.succeed('Config prepared.');
    } catch (err) {
      spinner.fail('Failed to prepare config');
      console.error('Error during processing Payload config', err);
    }
  });
};
