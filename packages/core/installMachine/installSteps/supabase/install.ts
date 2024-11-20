import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { supabaseFiles } from '../../../templates/supabase/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

const supabaseLogin = async () => {
  await logger.withSpinner('supabase', 'Logging in...', async (spinner) => {
    try {
      await execAsync('npx supabase projects list');
      spinner.succeed('Already logged in.');
    } catch (error) {
      try {
        await execAsync('npx supabase login');
        spinner.succeed('Logged in successfully.');
      } catch {
        spinner.fail('Failed to log in to Supabase.');
        console.error('Please log in manually with "supabase login" and re-run "stplr".');
        process.exit(1);
      }
    }
  });
};

const initializeSupabaseProject = async () => {
  await logger.withSpinner('supabase', 'Initializing project...', async (spinner) => {
    try {
      await execAsync(`npx supabase init`);
      spinner.succeed('Project initialized.');
    } catch (error: any) {
      const errorMessage = error.stderr;
      if (errorMessage.includes('file exists')) {
        spinner.succeed('Configuration file already exists.');
      } else {
        spinner.fail('Failed to initialize project.');
        console.error(
          'Please review the error message below, follow the initialization instructions, and try running "stplr" again.',
        );
        process.exit(1);
      }
    }
  });
};

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
