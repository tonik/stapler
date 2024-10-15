import { execSync } from 'child_process';

type EnvVariables = {
  name: 'SUPABASE_URL' | 'SUPABASE_ANON_KEY';
  value: string;
};

export function addEnvironmentVariable({ name, value }: EnvVariables) {
  console.log(`🖇️  Adding environment variable: ${name}`);
  execSync(`vercel env add ${name} ${value}`);
}
