import fs from 'fs/promises';

export const getDataFromVercelConfig = async () => {
  const data = await fs.readFile('.vercel/project.json', 'utf-8');
  try {
    const jsonData = JSON.parse(data);
    return { projectId: jsonData.projectId, orgId: jsonData.orgId };
  } catch (error) {
    console.error('Failed to read or parse vercel.json:', `\n${error}`);
    process.exit(1);
  }
};
