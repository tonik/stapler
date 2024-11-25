import fs from 'fs';
import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const createEnvFile = async () => {
  await logger.withSpinner('supabase', 'Writing local variables to .env file...', async (spinner) => {
    const output = await execAsync('npx supabase status --output json');
    const jsonData = JSON.parse(output.stdout);
    const envData = Object.entries(jsonData)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envData, 'utf8');
    spinner.succeed('Local variables written to .env file.');
  });
};
