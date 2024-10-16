import * as fs from 'fs';
import * as util from 'util';
const path = require('path');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

type EnvPair = [string, string];

interface EnvUpdateConfig {
  pairs: EnvPair[];
  appFolderName: string;
  isTest?: boolean;
}

const getEnvPath = (appFolderName: string, isTest: boolean): string => {
  if (isTest) {
    // Update path if needed
    return path.join(process.env.HOME || '', 'Documents', appFolderName, '.env');
  }
  return path.join(__dirname, appFolderName, '.env');
};

// Function to update a single line
const updateLine = (line: string, key: string, value: string): string => {
  if (line.startsWith(`${key}=`)) {
    return `${key}=${value}`;
  }
  return line;
};

export async function updateEnvFile({ appFolderName, pairs, isTest = false }: EnvUpdateConfig): Promise<void> {
  const envPath = getEnvPath(appFolderName, isTest);

  try {
    const data = await readFile(envPath, 'utf8');
    let lines = data.split('\n');

    lines = lines.map((line) => {
      for (const [key, value] of pairs) {
        line = updateLine(line, key, value);
      }
      return line;
    });

    const updatedContent = lines.join('\n');
    await writeFile(envPath, updatedContent, 'utf8');
    console.log('🖇️ Successfully updated .env file');
  } catch (error) {
    console.error('🖇️ Error updating .env file:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}
