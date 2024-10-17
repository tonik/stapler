import { addEnvironmentVariable } from './addEnvVariables';
import { connectToGit } from './connect';
import { getDeploymentUrl } from './getDeploymentUrl';
import { initializeVercelProject } from './initialize';
import { installVercel } from './install';
import { linkVercelProject } from './link';
import { loginToVercel } from './login';

export async function setupVercel() {
  installVercel();
  loginToVercel();
  initializeVercelProject();
  linkVercelProject();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl) {
    addEnvironmentVariable({ name: 'SUPABASE_URL', value: supabaseUrl, deployment: 'production' });
  }
  if (supabaseAnonKey) {
    addEnvironmentVariable({ name: 'SUPABASE_ANON_KEY', value: supabaseAnonKey, deployment: 'production' });
  }

  console.log('🖇️  Creating preview deployment...');
  const previewUrl = getDeploymentUrl(false);

  console.log('🖇️  Creating production deployment...');
  const productionUrl = getDeploymentUrl(true);

  console.log('____', previewUrl, productionUrl);

  connectToGit();
}