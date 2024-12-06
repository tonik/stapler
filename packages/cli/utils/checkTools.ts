import { checkGitHubCLI } from 'stplr-core/installMachine/installSteps/github/checkGitHubCLI';
import { checkSupabaseCLI } from 'stplr-core/installMachine/installSteps/supabase/checkSupabaseCLI';
import { checkVercelCLI } from 'stplr-core/installMachine/installSteps/vercel/checkVercelCLI';

export const checkTools = async () => {
  await checkGitHubCLI();
  await checkSupabaseCLI();
  await checkVercelCLI();
};
