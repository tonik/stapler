import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const access = util.promisify(fs.access);

type EnvPair = [string, string];

interface EnvUpdateConfig {
  currentDir: string;
  projectName: string;
  pairs: EnvPair[];
}

// Function to update a single line
const updateLine = (line: string, key: string, value: string): string => {
  if (line.startsWith(`${key}=`)) {
    return `${key}=${value}`;
  }
  return line;
};

export async function updateEnvFile({ currentDir, projectName, pairs }: EnvUpdateConfig): Promise<void> {
  const envFilePath = path.join(currentDir, projectName, '.env');
  try {
    // Check if the .env file exists
    try {
      await access(envFilePath); // Check if file exists
    } catch {
      // If it doesn't exist, create it with default values
      await writeFile(envFilePath, '', 'utf8');
    }

    const data = await readFile(envFilePath, 'utf8');
    let lines = data.split('\n');

    lines = lines.map((line) => {
      for (const [key, value] of pairs) {
        line = updateLine(line, key, value);
      }
      return line;
    });

    const updatedContent = lines.join('\n');
    await writeFile(envFilePath, updatedContent, 'utf8');
  } catch (error) {
    console.error('🖇️ Error updating .env file:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}
