import { existsSync } from 'fs';
import fs from 'fs/promises';
import { logger } from '../../../utils/logger';
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
      let data = await fs.readFile(payloadConfigPath, 'utf8');
  
      // Replace postgresAdapter with vercelPostgresAdapter
      const oldImport = `import { postgresAdapter } from '@payloadcms/db-postgres'`;
      const newImport = `import { vercelPostgresAdapter as postgresAdapter } from '@payloadcms/db-vercel-postgres'`;
  
      data = data.replace(oldImport, newImport);
  
      // Update the db configuration
      const dbConfig = `db: postgresAdapter({
      schemaName: "payload",
      pool: {
        connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URI || "",
      },
      })`;
  
      data = data.replace(
        /db:\s*postgresAdapter\(\{[\s\S]*?pool:\s*\{[\s\S]*?connectionString:[\s\S]*?\}[\s\S]*?\}\)/m,
        dbConfig,
      );
  
      // Write the updated payload.config.ts back to the file
      await fs.writeFile(payloadConfigPath, data);

      spinner.succeed('Config prepared.');
    } catch (err) {
      spinner.fail('Failed to prepare config');
      console.error('Error during processing Payload config', err);
    }
  });
};
