import fs from 'fs/promises';
import path from 'path';
import { getGlobalPathConfig } from './getGlobalPathConfig';

export const getVercelTokenFromAuthFile = async (): Promise<string | null> => {
  const globalPath = await getGlobalPathConfig('com.vercel.cli');
  if (!globalPath) {
    console.error('Global path not found. Cannot update project properties.');
    process.exit(1);
  }

  const filePath = path.join(globalPath, 'auth.json');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData.token || null;
  } catch (error) {
    console.error('Failed to read or parse auth.json:', `\n${error}`);
    process.exit(1);
  }
};
