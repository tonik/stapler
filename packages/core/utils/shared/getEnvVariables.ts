const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

interface EnvVariables {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_JWT_SECRET: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  // add INNGEST_API_KEY and INNGEST_API_SECRET ???
}

const envVariablesToExtract: Array<keyof EnvVariables> = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_JWT_SECRET',
  'SUPABASE_SERVICE_ROLE_KEY',
  // add INNGEST_API_KEY and INNGEST_API_SECRET ???
];

function getEnvVariables(appFolderName: string): Partial<EnvVariables> {
  const envPath = path.join(__dirname, appFolderName, '.env');

  if (!fs.existsSync(envPath)) {
    // TODO Change error
    console.error(`.env file not found at ${envPath}`);
    return {};
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  const extractedVariables: Partial<EnvVariables> = {};

  envVariablesToExtract.forEach((key) => {
    if (envConfig.hasOwnProperty(key)) {
      extractedVariables[key] = envConfig[key];
    }
  });

  return extractedVariables;
}
