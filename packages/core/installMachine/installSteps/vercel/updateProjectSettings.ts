import { logger } from 'stplr-utils';
import { getDataFromVercelConfig } from '../../../utils/getDataFromVercelConfig';
import { getVercelTokenFromAuthFile } from '../../../utils/getVercelTokenFromAuthFile';

export const updateVercelProjectSettings = async () => {
  await logger.withSpinner('vercel', 'Changing project settings...', async (spinner) => {
    try {
      const token = await getVercelTokenFromAuthFile();
      if (!token) {
        spinner.fail('Token not found. Cannot update project properties.');
        process.exit(1);
      }

      const { projectId, orgId } = await getDataFromVercelConfig();
      const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}?teamId=${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

      spinner.succeed('Project settings updated successfully.');
    } catch (error) {
      spinner.fail('Failed to update project settings.');
      console.error('Error during Vercel project settings update:', error);
    }
  });
};
