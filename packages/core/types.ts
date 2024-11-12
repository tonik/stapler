export interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export interface StepsCompleted {
  initializeProject: boolean;
  installSupabase: boolean;
  installPayload: boolean;
  createDocFiles: boolean;
  prettifyCode: boolean;
  prepareDrink: boolean;
  initializeRepository: boolean;
  pushToGitHub: boolean;
  createSupabaseProject: boolean;
  setupAndCreateVercelProject: boolean;
  updateVercelProjectSettings: boolean;
  connectSupabaseProject: boolean;
  deployVercelProject: boolean;
}

export interface StaplerState {
  version: number;
  projectName: string;
  stepsCompleted: StepsCompleted;
  options: ProjectOptions;
}

export interface InstallMachineContext {
  type: 'install';
  projectDir: string;
  stateData: StaplerState;
}
