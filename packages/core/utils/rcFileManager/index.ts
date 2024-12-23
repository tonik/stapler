import fs from 'fs';
import path from 'path';
import { StaplerState } from '../../types';

const RC_FILE_NAME = '.staplerrc';

export const initializeRcFile = (
  projectDir: string,
  name: string,
  usePayload: boolean,
  shouldDeploy: boolean,
): StaplerState => {
  const rcFilePath = path.join(projectDir, RC_FILE_NAME);
  if (fs.existsSync(rcFilePath)) {
    const data = fs.readFileSync(rcFilePath, 'utf-8');
    return JSON.parse(data) as StaplerState;
  } else {
    // Initialize default state
    const initialState: StaplerState = {
      version: 1,
      projectName: name,
      stepsCompleted: {
        createTurbo: false,
        modifyGitignore: false,
        installTailwind: false,
        modifyHomepage: false,
        installSupabase: false,
        installPayload: false,
        createDocFiles: false,
        prettifyCode: false,
        shouldDeploy: false,
        prepareDrink: false,
        initializeRepository: false,
        pushToGitHub: false,
        createSupabaseProject: false,
        chooseVercelTeam: false,
        linkVercelProject: false,
        updateVercelProjectSettings: false,
        connectSupabaseProject: false,
        deployVercelProject: false,
      },
      options: {
        name: name,
        usePayload: usePayload,
        shouldDeploy: shouldDeploy,
      },
      githubCandidateName: name,
      selectedAccount: '',
      prettyDeploymentUrl: '',
    };
    return initialState;
  }
};

export const saveStateToRcFile = (state: StaplerState, projectDir: string): void => {
  const rcFilePath = path.join(projectDir, RC_FILE_NAME);
  fs.writeFileSync(rcFilePath, JSON.stringify(state, null, 2));
};
