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

      const postgresAdapterImport = `import { postgresAdapter } from '@payloadcms/db-postgres'`;
      const vercelPostgresAdapterImport = `import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'`;

      // Add the vercelPostgresAdapter import after postgresAdapter if it's not already present
      if (!data.includes(vercelPostgresAdapterImport)) {
        data = data.replace(postgresAdapterImport, `${postgresAdapterImport}\n${vercelPostgresAdapterImport}`);
      } else {
        console.log('vercelPostgresAdapter import is already present.');
      }

      // Step 2: Replace the db configuration with conditional configuration
      const newDbConfig = `db: process.env.POSTGRES_URL
        ? vercelPostgresAdapter({
            schemaName: "payload",
            pool: {
              connectionString: process.env.POSTGRES_URL || "",
            },
          })
        : postgresAdapter({
            schemaName: "payload",
            pool: {
              connectionString: process.env.DATABASE_URI || "",
            },
          })`;

      data = data.replace(
        /db:\s*postgresAdapter\(\{[\s\S]*?pool:\s*\{[\s\S]*?connectionString:[\s\S]*?\}[\s\S]*?\}\)/m,
        newDbConfig,
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
