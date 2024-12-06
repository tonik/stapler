import * as os from 'os';
import { execAsync } from '../../../utils/execAsync';
import { logger } from 'stplr-utils';

const isSupabaseCLIInstalled = async (): Promise<boolean> => {
  try {
    await execAsync('supabese --version');
    return true;
  } catch (error) {
    return false;
  }
};

const installSupabaseCLI = async (): Promise<boolean> => {
  const platform = os.platform();
  let installCommand: string;

  switch (platform) {
    case 'darwin':
      installCommand = 'brew install supabase/tap/supabase';
      break;
    case 'linux':
      installCommand = 'brew install supabase/tap/supabase';
      break;
    case 'win32':
      installCommand =
        'scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase';
      break;
    default:
      logger.log('supabase', [
        'Automatic installation is not supported for your operating system.',
        '\nPlease visit https://supabase.com/docs/guides/cli/getting-started for installation instructions.',
      ]);
      return false;
  }

  logger.log('supabase', 'Installing Supabase CLI...');
  try {
    await execAsync(installCommand);
    return true;
  } catch (error) {
    console.error('Failed to install Supabase CLI.');
    logger.log('supabase', 'Please install it manually from: https://supabase.com/docs/guides/cli/getting-started');
    return false;
  }
};

export const checkSupabaseCLI = async () => {
  await logger.withSpinner('supabase', 'Checking if Supabase CLI is installed...', async (spinner) => {
    if (!isSupabaseCLIInstalled()) {
      logger.log('supabase', 'Supabase CLI is not installed.');

      const installed = await installSupabaseCLI();
      if (!installed) {
        spinner.fail('Supabase CLI installation failed. Exiting...');
        console.error('Supabase CLI installation failed. Exiting...');
        process.exit(1);
      }
      spinner.succeed('CLI: Ready');
    } else {
      spinner.succeed('CLI: Ready');
    }
  });
};
