import { getDeploymentUrl } from './getDeploymentUrl';

export async function setupVercel() {
  // installVercel();
  // loginToVercel();
  // initializeVercelProject();
  // linkVercelProject();

  // const supabaseUrl = process.env.SUPABASE_URL;
  // const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  // if (supabaseUrl) {
  //   addEnvironmentVariable({ name: 'SUPABASE_URL', value: supabaseUrl, deployment: 'production' });
  // }
  // if (supabaseAnonKey) {
  //   addEnvironmentVariable({ name: 'SUPABASE_ANON_KEY', value: supabaseAnonKey, deployment: 'production' });
  // }

  console.log('🖇️  Creating preview deployment...');
  const previewUrl = getDeploymentUrl(false);

  console.log('🖇️  Creating production deployment...');
  const productionUrl = getDeploymentUrl(true);

  console.log('____', previewUrl, productionUrl);

  // connectToGit();
}
