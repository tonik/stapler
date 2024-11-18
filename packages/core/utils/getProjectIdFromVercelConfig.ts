import fs from 'fs/promises';

export const getProjectIdFromVercelConfig = async (): Promise<string | null> => {
  const data = await fs.readFile('.vercel/project.json', 'utf-8');
  try {
    const jsonData = JSON.parse(data);
    return jsonData.projectId;
  } catch (error) {
    console.error('Failed to read or parse vercel.json:', `\n${error}`);
    process.exit(1);
  }
};
