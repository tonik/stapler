import fs from 'fs';
import path from 'path';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

const requiredEnvVariables: Record<string, 'required' | 'optional'> = {
  NEXT_PUBLIC_SUPABASE_URL: 'required',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'required',
  SUPABASE_URL: 'required',
  SUPABASE_ANON_KEY: 'required',
  SUPABASE_JWT_SECRET: 'required',
  SUPABASE_SERVICE_ROLE_KEY: 'required',
  // DATABASE_URI:"required", // this is created by Payload in web app directory
  // PAYLOAD_SECRET:"required", // this is created by Payload in web app directory
};

// Function to create .env file with empty fields
export const createEnvFile = (destinationDirectory: string) => {
  logWithColoredPrefix('stapler', 'Creating .env file...');
  let envTemplate = '';
  for (const [key, status] of Object.entries(requiredEnvVariables)) {
    envTemplate += `${key}=\n`;
  }

  if (destinationDirectory) {
    fs.writeFileSync(path.resolve(destinationDirectory, '.env'), envTemplate);
  } else {
    throw new Error(`Directory does not exist: ${destinationDirectory}`);
  }
};
