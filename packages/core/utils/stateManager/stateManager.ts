import fs from 'fs';
import path from 'path';
import { StaplerState } from '../../types';

const rcFileName = '.staplerrc';
let rcFilePath: string;

export function initializeState(projectDir: string): StaplerState {
  rcFilePath = path.join(projectDir, rcFileName);
  if (fs.existsSync(rcFilePath)) {
    const data = fs.readFileSync(rcFilePath, 'utf-8');
    return JSON.parse(data) as StaplerState;
  } else {
    // Initialize default state
    const initialState: StaplerState = {
      version: 1,
      projectName: '',
      stepsCompleted: {
        initializeProject: false,
        createEnvFile: false,
        installPayload: false,
        installSupabase: false,
        prettifyCode: false,
        prepareDrink: false,
        initializeRepository: false,
        pushToGitHub: false,
      },
      options: {
        name: '',
        usePayload: false,
      },
    };
    return initialState;
  }
}

export function saveState(state: StaplerState, projectDir: string): void {
  const rcFilePath = projectDir + '/' + rcFileName;
  fs.writeFileSync(rcFilePath, JSON.stringify(state, null, 2));
}
