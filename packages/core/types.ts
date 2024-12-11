export interface ProjectOptions {
  name: string;
  usePayload: boolean;
  shouldDeploy: boolean;
}

export interface StepsCompleted {
  createTurbo: boolean;
  modifyGitignore: boolean;
  installTailwind: boolean;
  modifyHomepage: boolean;
  installSupabase: boolean;
  installPayload: boolean;
  createDocFiles: boolean;
  prettifyCode: boolean;
  shouldDeploy: boolean;
  initializeRepository: boolean;
  pushToGitHub: boolean;
  createSupabaseProject: boolean;
  chooseVercelTeam: boolean;
  linkVercelProject: boolean;
  updateVercelProjectSettings: boolean;
  connectSupabaseProject: boolean;
  deployVercelProject: boolean;
  prepareDrink: boolean;
}

export interface StaplerState {
  version: number;
  projectName: string;
  stepsCompleted: StepsCompleted;
  options: ProjectOptions;
  githubCandidateName: string;
  selectedAccount: string;
  prettyDeploymentUrl: string;
}

export interface InstallMachineContext {
  type: 'install';
  projectDir: string;
  stateData: StaplerState;
}
