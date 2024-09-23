import * as fs from 'fs';
import * as path from 'path';

// Define required and optional env variables
const requiredEnvVariables: Record<string, 'required' | 'optional'> = {
  NEXT_PUBLIC_SUPABASE_URL:"required",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:"required",
  SUPABASE_URL: "required",
  SUPABASE_ANON_KEY: "required",
  SUPABASE_JWT_SECRET:"required",
  SUPABASE_SERVICE_ROLE_KEY:"required",
  POSTGRES_URL:"required",
  PAYLOAD_SECRET:"required",
  // INNGEST_API_KEY: "required",
  // INNGEST_API_SECRET: "optional",
};

// Path to the .env file
const envPath = path.resolve(process.cwd(), '.env');

// Function to check if .env file exists
const checkEnvFile = () => {
  if (!fs.existsSync(envPath)) {
    console.log('🍸 .env file does not exist, creating one...');
    createEnvFile();
  } else {
    console.log('🍸 .env file exists, checking values...');
    checkEnvValues();
  }
};

// Function to create .env file with empty fields
export const createEnvFile = () => {
  let envTemplate = '';
  for (const [key, status] of Object.entries(requiredEnvVariables)) {
    envTemplate += `${key}=\n`;
  }

  fs.writeFileSync(envPath, envTemplate);
  console.log('🍸 Please fill in the env values in the .env file.');
};

// Function to check if all required values are present in the .env file
const checkEnvValues = () => {
  const envFileContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envFileContent.split('\n').filter(Boolean) as string[];

  const missingEnvVariables: string[] = [];

  envLines.forEach((line) => {
    const [key, value] = line.split('=');
    // Casting key as keyof typeof requiredEnvVariables ensures the key is checked against known keys
    if ((requiredEnvVariables as Record<string, 'required' | 'optional'>)[key] === 'required' && !value) {
      missingEnvVariables.push(key);
    }
  });

  // Also check if any required key is completely missing from the .env file
  for (const key of Object.keys(requiredEnvVariables)) {
    if (!envFileContent.includes(key)) {
      missingEnvVariables.push(key);
    }
  }

  if (missingEnvVariables.length > 0) {
    console.log(`🍸 Missing values for: ${missingEnvVariables.join(', ')}`);
    console.log('🍸 Please update your .env file.');
  } else {
    console.log('🍸 .env file is properly configured! 🎉');
  }
};

// Initialize the check
checkEnvFile();