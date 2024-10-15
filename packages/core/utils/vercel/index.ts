import { addEnvironmentVariable } from './addEnvVariables';
import { connectToGit } from './connect';
import { deployProject } from './deploy';
import { initializeVercelProject } from './initialize';
import { installVercel } from './install';
import { linkVercelProject } from './link';
import { loginToVercel } from './login';

export function setupVercel() {
  installVercel();
  loginToVercel();
  initializeVercelProject();
  linkVercelProject();

  const extractedEnvVars = getEnvVariables('here name o the folder my-stapler-app'); //TODO
  if (extractedEnvVars.SUPABASE_URL) {
    addEnvironmentVariable({ name: 'SUPABASE_URL', value: extractedEnvVars.SUPABASE_URL });
  }
  if (extractedEnvVars.SUPABASE_ANON_KEY) {
    addEnvironmentVariable({ name: 'SUPABASE_ANON_KEY', value: extractedEnvVars.SUPABASE_ANON_KEY });
  }

  deployProject();
  connectToGit();
}
