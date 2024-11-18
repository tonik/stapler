import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { supabaseFiles } from '../../../templates/supabase/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';
import { initializeSupabaseProject } from './initializeSupabaseProject';
import { modifySupabaseConfig } from './modifySupabaseConfig';
import { supabaseLogin } from './supabaseLogin';

export const installSupabase = async (destinationDirectory: string) => {
  try {
    await supabaseLogin();
    await initializeSupabaseProject();
  } catch (error) {
    console.error('Failed to init project.', `\nError: ${error}`);
    process.exit(1);
  }

  await logger.withSpinner('supabase', 'Adding files from template...', async (spinner) => {
    const templateDirectory = getTemplateDirectory(`/templates/supabase/files/`);
    templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);

    // Add "supabase/**" to pnpm-workspace.yaml
    const workspacePath = path.join(destinationDirectory, 'pnpm-workspace.yaml');
    const addSupabaseToWorkspace = `  - "supabase/**"`;
    const fileContents = fs.readFileSync(workspacePath, 'utf-8');
    if (!fileContents.includes(addSupabaseToWorkspace)) {
      fs.appendFileSync(workspacePath, `${addSupabaseToWorkspace}\n`);
    }

    spinner.succeed('Files added.');
  });

  // Modify supabase/config.toml to enable db.pooler
  await modifySupabaseConfig(destinationDirectory);

  process.chdir('supabase');

  await logger.withSpinner('supabase', 'Installing dependencies...', async (spinner) => {
    await execAsync('pnpm i --reporter silent');
    spinner.succeed('Dependencies installed.');
  });

  await logger.withSpinner('supabase', 'Starting local database...', async (spinner) => {
    try {
      await execAsync('npx supabase start');
      spinner.succeed('Local database started.');
    } catch (error) {
      spinner.fail(`Failed to start local database. Is your ${chalk.hex('#0db7ed')('Docker')} daemon running?`);
      console.error(`\n${error}`);
      process.exit(1);
    }
  });

  await logger.withSpinner('supabase', 'Writing local variables to .env file...', async (spinner) => {
    const output = await execAsync('npx supabase status --output json');
    const jsonData = JSON.parse(output.stdout);
    const envData = Object.entries(jsonData)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envData, 'utf8');
    spinner.succeed('Local variables written to .env file.');
  });

  process.chdir('..');
};
