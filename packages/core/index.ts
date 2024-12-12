import { InstallMachineContext, ProjectOptions, StaplerState } from './types';
import { initializeRcFile } from './utils/rcFileManager';
import { installMachine } from './installMachine/index';

export const createProject = async (options: ProjectOptions, projectDir: string): Promise<void> => {
  const { name, usePayload, shouldDeploy } = options;

  let state: StaplerState = initializeRcFile(projectDir, name, usePayload, shouldDeploy);
  state.options = options;

  const context: InstallMachineContext = {
    type: 'install',
    projectDir: projectDir,
    stateData: state,
  };

  installMachine(context).start();
};
