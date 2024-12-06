import { InstallMachineContext } from '../../../types';
import { createGitHubRepository, fetchGitHubUsername, setupGitRepository } from './repositoryManager';

interface ProjectRepositoryOptions {
  projectName: string;
  stateData: InstallMachineContext['stateData'];
}

export const initializeRepository = async (options: ProjectRepositoryOptions) => {
  const { projectName, stateData } = options;

  const username = await fetchGitHubUsername();

  await createGitHubRepository(projectName, username, stateData);
  await setupGitRepository();
};
