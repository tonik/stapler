export interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export interface StepsCompleted {
  initializeProject: boolean;
  createEnvFile: boolean;
  installPayload: boolean;
  installSupabase: boolean;
  createDocFiles: boolean;
  prettifyCode: boolean;
  prepareDrink: boolean;
  initializeRepository: boolean;
  pushToGitHub: boolean;
  createSupabaseProject: boolean;
  setupAndCreateVercelProject: boolean;
  connectSupabaseProject: boolean;
  deployVercelProject: boolean;
}

export interface StaplerState {
  version: number;
  projectName: string;
  stepsCompleted: StepsCompleted;
  options: ProjectOptions;
}