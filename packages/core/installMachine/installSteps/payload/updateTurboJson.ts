import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../../../utils/logger';

export const updateTurboJson = async () => {
  const turboJsonPath = path.resolve('turbo.json');
  await logger.withSpinner('payload', 'Updating turbo.json...', async (spinner) => {
    try {
      // Read and parse turbo.json
      const turboData = JSON.parse(await fs.readFile(turboJsonPath, 'utf8'));

      // Update turbo.json with the new structure
      turboData.tasks = {
        ...turboData.tasks,
        'web#db:migrate': {
          cache: false,
        },
        build: {
          dependsOn: ['^web#db:migrate', '^build'],
          outputs: ['dist/**'],
        },
        'build:core': {
          outputs: ['dist/**'],
        },
      };

      turboData.globalEnv = [
        'SUPABASE_JWT_SECRET',
        'POSTGRES_URL',
        'PAYLOAD_SECRET',
        'SUPABASE_SERVICE_ROLE_KEY',
        'NEXT_PUBLIC_*',
        'PORT',
      ];

      // Write the modified turbo.json
      await fs.writeFile(turboJsonPath, JSON.stringify(turboData, null, 2));
      spinner.succeed('turbo.json updated.');
    } catch (error) {
      spinner.fail('Failed to update turbo.json.');
      console.error('Error updating files:', error);
    }
  });
};
