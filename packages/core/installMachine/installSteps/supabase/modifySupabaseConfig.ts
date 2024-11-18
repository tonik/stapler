import path from 'path';
import fs from 'fs';
import { logger } from '../../../utils/logger';

export const modifySupabaseConfig = async (destinationDirectory: string) => {
  const configPath = path.join(destinationDirectory, 'supabase', 'config.toml');
  await logger.withSpinner('supabase', 'Modifying config.toml...', async (spinner) => {
    if (!fs.existsSync(configPath)) {
      console.error(`config.toml file not found at ${configPath}`);
      process.exit(1);
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');

      // Modify [db.pooler] enabled = false to enabled = true
      let modifiedContent;
      if (configContent.includes('[db.pooler]')) {
        modifiedContent = configContent.replace(/\[db\.pooler\]\s+enabled\s*=\s*false/, '[db.pooler]\nenabled = true');
      } else {
        // Append the [db.pooler] section at the end if it doesn't exist
        modifiedContent = `${configContent}\n[db.pooler]\nenabled = true\n`;
      }

      fs.writeFileSync(configPath, modifiedContent, 'utf-8');
      spinner.succeed('config.toml modified.');
    } catch (error) {
      spinner.fail('Failed to modify config.toml.');
      console.error(error);
      process.exit(1);
    }
  });
};
