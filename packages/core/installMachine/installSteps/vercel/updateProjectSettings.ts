import fs from 'fs/promises';
import path from 'path';
import { getGlobalPathConfig } from './getGlobalPathConfig';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

const getTokenFromAuthFile = async (filePath: string): Promise<string | null> => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(data);
    return jsonData.token || null;
  } catch (error) {
    console.error('Failed to read or parse auth.json:', `\n${error}`);
    process.exit(1);
  }
};

const getProjectIdFromVercelConfig = async (): Promise<string | null> => {
  const data = await fs.readFile('.vercel/project.json', 'utf-8');
  try {
    const jsonData = JSON.parse(data);
    return jsonData.projectId;
  } catch (error) {
    console.error('Failed to read or parse vercel.json:', `\n${error}`);
    process.exit(1);
  }
};

export const updateProjectSettings = async () => {
  logWithColoredPrefix('vercel', 'Changing project settings...');
  const globalPath = await getGlobalPathConfig();
  if (!globalPath) {
    console.error('Global path not found. Cannot update project properties.');
    process.exit(1);
  }
  const filePath = path.join(globalPath, 'auth.json');

  const token = await getTokenFromAuthFile(filePath);
  if (!token) {
    console.error('Token not found. Cannot update project properties.');
    process.exit(1);
  }

  const projectId = await getProjectIdFromVercelConfig();

  const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      framework: 'nextjs',
      rootDirectory: 'apps/web',
    }),
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error(`Failed to update project properties: ${response.statusText}`);
  }
};
