import { execSync } from 'child_process';

type EnvVariables = {
  name: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY';
  value: string;
  deployment: 'production' | 'preview';
};

export function addEnvironmentVariable({ name, value, deployment }: EnvVariables) {
  console.log(`🖇️  Adding environment variable: ${name}`);
  execSync(`echo ${value} | vercel env add ${name} ${deployment}`);
}
