import { execAsync } from '../../../utils/execAsync';
import { logger } from '../../../utils/logger';

export const fetchOrganizations = async (): Promise<{ name: string; writable: boolean }[]> => {
  return await logger.withSpinner('github', 'Fetching organizations you belong to...', async (spinner) => {
    try {
      // Fetch all organizations the user belongs to
      const orgsOutput = await execAsync(`gh api user/orgs --jq '[.[] | {name: .login, repos_url: .repos_url}]'`);
      const orgs = JSON.parse(orgsOutput.stdout);

      // Process each organization
      const orgsWithPermissions = await Promise.all(
        orgs.map(async (org: { name: string; repos_url: string }) => {
          try {
            // Fetch repositories in the organization
            const reposOutput = await execAsync(`gh api ${org.repos_url} --jq '[.[] | {permissions: .permissions}]'`);
            const repos = JSON.parse(reposOutput.stdout);

            if (repos.length === 0) {
              // Organization has no repositories, assume writable since we can't yet determine permissions
              return { name: org.name, writable: true };
            }

            // Check if user has write access to any repository in the organization
            const hasWriteAccess = repos.some((repo: any) => repo.permissions?.push || repo.permissions?.admin);
            return { name: org.name, writable: hasWriteAccess };
          } catch (error: any) {
            if (error.message.includes('HTTP 403')) {
              return { name: org.name, writable: false }; // Mark as inaccessible
            }

            // For other errors, log and continue
            console.error(`Error processing organization: ${org.name}`, error);
            return { name: org.name, writable: false };
          }
        }),
      );

      spinner.succeed('Fetched organizations successfully.');
      return orgsWithPermissions;
    } catch (error) {
      spinner.fail('Failed to fetch organizations.');
      console.error(error);
      return [];
    }
  });
};
