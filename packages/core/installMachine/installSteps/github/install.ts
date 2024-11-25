import { checkGitHubCLI } from './checkGitHubCLI';
import { ensureGitHubAuthentication } from './ensureGitHubAuthentication';
import { createGitHubRepository, fetchGitHubUsername, setupGitRepository } from './repositoryManager';
import { InstallMachineContext } from '../../../types';

interface ProjectRepositoryOptions {
  projectName: string;
  stateData: InstallMachineContext['stateData'];
}

export const initializeRepository = async (options: ProjectRepositoryOptions) => {
  const { projectName, stateData } = options;

  await checkGitHubCLI();
  await ensureGitHubAuthentication();

  const username = await fetchGitHubUsername();

  await createGitHubRepository(projectName, username, stateData);
  await setupGitRepository();
};
