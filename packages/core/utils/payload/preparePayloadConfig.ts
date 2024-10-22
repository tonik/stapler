import type { PathLike } from 'fs';
import fs from 'fs/promises';

export const preparePayloadConfig = async (configPath: PathLike) => {
  console.log('🖇️ Preparing payload.config.ts...');

  try {
    let data = await fs.readFile(configPath, 'utf8');

    // Update the db configuration
    const dbConfig = `db: postgresAdapter({
    schemaName: "payload",
    pool: {
      connectionString: process.env.SUPABASE_URL || process.env.DATABASE_URI || "",
    },
    })`;

    data = data.replace(
      /db:\s*postgresAdapter\(\{[\s\S]*?pool:\s*\{[\s\S]*?connectionString:[\s\S]*?\}[\s\S]*?\}\)/m,
      dbConfig,
    );

    // Write the updated payload.config.ts back to the file
    await fs.writeFile(configPath, data);
  } catch (err) {
    console.error('🖇️ Error during processing payload.config.ts', err);
  }
};
