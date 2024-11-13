import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';
import { getProjectIdFromVercelConfig } from '../../../utils/getProjectIdFromVercelConfig';
import { getVercelTokenFromAuthFile } from '../../../utils/getVercelTokenFromAuthFile';

export const updateVercelProjectSettings = async () => {
  logWithColoredPrefix('vercel', 'Changing project settings...');

  const token = await getVercelTokenFromAuthFile();
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
