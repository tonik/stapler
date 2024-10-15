export interface ProjectOptions {
  name: string;
  usePayload: boolean;
}

export interface StepsCompleted {
  initializeProject: boolean;
  createEnvFile: boolean;
  installPayload: boolean;
  installSupabase: boolean;
  prettifyCode: boolean;
  prepareDrink: boolean;
  initializeRepository: boolean;
}

export interface StaplerState {
  version: number;
  projectName: string;
  stepsCompleted: StepsCompleted;
  options: ProjectOptions;
}
