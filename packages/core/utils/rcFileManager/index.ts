import fs from 'fs';
import path from 'path';
import { StaplerState } from '../../types';

const RC_FILE_NAME = '.staplerrc';

export const initializeRcFile = (projectDir: string, name: string, usePayload: boolean): StaplerState => {
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
        initializeProject: false,
        installPayload: false,
        installSupabase: false,
        prettifyCode: false,
        createDocFiles: false,
        createSupabaseProject: false,
        setupAndCreateVercelProject: false,
        updateVercelProjectSettings: false,
        connectSupabaseProject: false,
        deployVercelProject: false,
        prepareDrink: false,
        initializeRepository: false,
        pushToGitHub: false,
      },
      options: {
        name: name,
        usePayload: usePayload,
      },
    };
    return initialState;
  }
};

export const saveStateToRcFile = (state: StaplerState, projectDir: string): void => {
  const rcFilePath = path.join(projectDir, RC_FILE_NAME);
  fs.writeFileSync(rcFilePath, JSON.stringify(state, null, 2));
};