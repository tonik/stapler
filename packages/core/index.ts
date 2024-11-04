import {
  createMachine,
  fromPromise,
  createActor,
  ActorLogic,
  AnyEventObject,
  StateFrom,
  PromiseSnapshot,
} from 'xstate';

import { ProjectOptions, StaplerState } from './types';
import { initializeState, saveState } from './utils/stateManager/stateManager';
import { createEnvFile } from './utils/env/createEnvFile';
import { initializeRepository } from './utils/github/install';
import { preparePayload } from './utils/payload/install';
import { prettify } from './utils/prettier/prettify';
import { connectSupabaseProject } from './utils/supabase/connectProject';
import { createSupabaseProject } from './utils/supabase/createProject';
import { installSupabase } from './utils/supabase/install';
import { createTurboRepo } from './utils/turbo/create';
import { deployVercelProject } from './utils/vercel/deploy';
import { setupAndCreateVercelProject } from './utils/vercel/setupAndCreate';
import { prepareDrink } from './utils/bar/prepareDrink';
import { createDocFiles } from './utils/docs/create';
import { pushToGitHub } from './utils/github/repositoryManager';
import { logWithColoredPrefix } from './utils/shared/logWithColoredPrefix';

interface InstallMachineContext {
  type: 'install';
  projectDir: string;
  stateData: StaplerState;
}

const createStepMachine = (
  performStepFunction: ActorLogic<PromiseSnapshot<void, InstallMachineContext>, AnyEventObject, InstallMachineContext>,
) => {
  return createMachine({
    id: 'stepActor',
    initial: 'init',
    context: ({ input }) => input,
    states: {
      init: {
        always: 'unprovisioned',
      },
      unprovisioned: {
        invoke: {
          src: performStepFunction,
          input: ({ context }) => context,
          onDone: 'provisioned',
        },
      },
      provisioned: {
        type: 'final',
      },
    },
  });
};

const createInstallMachine = (initialContext: InstallMachineContext) => {
  const installMachine = createMachine(
    {
      id: 'installProcess',
      initial: 'initializeProject',
      context: initialContext,
      states: {
        initializeProject: {
          invoke: {
            src: 'initializeProjectActor',
            input: ({ context }) => context,
            onDone: 'createEnvFile',
            onError: 'failed',
          },
        },
        createEnvFile: {
          invoke: {
            src: 'createEnvFileActor',
            onDone: [
              {
                guard: 'shouldInstallPayload',
                target: 'installPayload',
              },
              { target: 'installSupabase' },
            ],
            onError: 'failed',
          },
        },
        installPayload: {
          invoke: {
            src: 'installPayloadActor',
            onDone: 'installSupabase',
            onError: 'failed',
          },
        },
        installSupabase: {
          invoke: {
            src: 'installSupabaseActor',
            onDone: 'createDocFiles',
            onError: 'failed',
          },
        },
        createDocFiles: {
          invoke: {
            src: 'createDocFilesActor',
            onDone: 'prettifyCode',
            onError: 'failed',
          },
        },
        prettifyCode: {
          invoke: {
            src: 'prettifyCodeActor',
            onDone: 'initializeRepository',
            onError: 'failed',
          },
        },
        initializeRepository: {
          invoke: {
            src: 'initializeRepositoryActor',
            onDone: 'pushToGitHub',
            onError: 'failed',
          },
        },
        pushToGitHub: {
          invoke: {
            src: 'pushToGitHubActor',
            onDone: 'createSupabaseProject',
            onError: 'failed',
          },
        },
        createSupabaseProject: {
          invoke: {
            src: 'createSupabaseProjectActor',
            onDone: 'setupAndCreateVercelProject',
            onError: 'failed',
          },
        },
        setupAndCreateVercelProject: {
          invoke: {
            src: 'setupAndCreateVercelProjectActor',
            onDone: 'connectSupabaseProject',
            onError: 'failed',
          },
        },
        connectSupabaseProject: {
          invoke: {
            src: 'connectSupabaseProjectActor',
            onDone: 'deployVercelProject',
            onError: 'failed',
          },
        },
        deployVercelProject: {
          invoke: {
            src: 'deployVercelProjectActor',
            onDone: 'prepareDrink',
            onError: 'failed',
          },
        },
        prepareDrink: {
          invoke: {
            src: 'prepareDrinkActor',
            onDone: 'done',
            onError: 'failed',
          },
        },
        done: {
          type: 'final',
          entry: () => logWithColoredPrefix('stapler', 'Installation process completed!'),
        },
        failed: {
          type: 'final',
          entry: ({ context, event }) => {
            console.error('Installation process failed.', event.data);
            process.exit(1);
          },
        },
      },
    },
    {
      guards: {
        shouldInstallPayload: ({ context }) => {
          return context.stateData.options.usePayload;
        },
      },
      actors: {
        initializeProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const { name } = input.stateData.options;
              await createTurboRepo(name);
              process.chdir(name);
              input.stateData.stepsCompleted.initializeProject = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in initializeProjectActor:', error);
              throw error;
            }
          }),
        ),
        createEnvFileActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              logWithColoredPrefix('stapler', 'Creating env file in actor...');
              createEnvFile(input.projectDir);
              input.stateData.stepsCompleted.createEnvFile = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createEnvFileActor:', error);
              throw error;
            }
          }),
        ),
        installPayloadActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await preparePayload();
              input.stateData.stepsCompleted.installPayload = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in installPayloadActor:', error);
              throw error;
            }
          }),
        ),
        installSupabaseActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const currentDir = process.cwd();
              await installSupabase(currentDir);
              input.stateData.stepsCompleted.installSupabase = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in installSupabaseActor:', error);
              throw error;
            }
          }),
        ),
        createDocFilesActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              createDocFiles();
              input.stateData.stepsCompleted.createDocFiles = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createDocFilesActor:', error);
              throw error;
            }
          }),
        ),
        prettifyCodeActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              prettify();
              input.stateData.stepsCompleted.prettifyCode = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in prettifyCodeActor:', error);
              throw error;
            }
          }),
        ),
        initializeRepositoryActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await initializeRepository({ projectName: input.stateData.options.name, visibility: 'private' });
              input.stateData.stepsCompleted.initializeRepository = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in initializeRepositoryActor:', error);
              throw error;
            }
          }),
        ),
        pushToGitHubActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              pushToGitHub(input.stateData.options.name);
              input.stateData.stepsCompleted.pushToGitHub = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in pushToGitHubActor:', error);
              throw error;
            }
          }),
        ),
        createSupabaseProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await createSupabaseProject(input.stateData.options.name);
              input.stateData.stepsCompleted.createSupabaseProject = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createSupabaseProjectActor:', error);
              throw error;
            }
          }),
        ),
        setupAndCreateVercelProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await setupAndCreateVercelProject();
              input.stateData.stepsCompleted.setupAndCreateVercelProject = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in setupAndCreateVercelProjectActor:', error);
              throw error;
            }
          }),
        ),
        connectSupabaseProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const currentDir = process.cwd();
              await connectSupabaseProject(input.stateData.options.name, currentDir);
              input.stateData.stepsCompleted.connectSupabaseProject = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in connectSupabaseProjectActor:', error);
              throw error;
            }
          }),
        ),
        deployVercelProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await deployVercelProject();
              input.stateData.stepsCompleted.deployVercelProject = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in deployVercelProjectActor:', error);
              throw error;
            }
          }),
        ),
        prepareDrinkActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const { projectName } = input.stateData;
              prepareDrink(projectName);
              input.stateData.stepsCompleted.prepareDrink = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in prepareDrinkActor:', error);
              throw error;
            }
          }),
        ),
      },
    },
  );
  return installMachine;
};

export const createProject = async (options: ProjectOptions, projectDir: string): Promise<void> => {
  const { name, usePayload } = options;

  let state: StaplerState = initializeState(projectDir, name, usePayload);
  state.options = options;

  const currentDir = process.cwd();

  const context: InstallMachineContext = {
    type: 'install',
    projectDir: projectDir,
    stateData: state,
  };

  const installMachine = createInstallMachine(context);
  const installActor = createActor(installMachine);

  installActor.subscribe((state: StateFrom<typeof installMachine>) => {
    if (state.matches('done')) {
      logWithColoredPrefix('stapler', 'Installation process completed!');
    } else if (state.matches('failed')) {
      console.error('Installation process failed.');
    }
  });

  installActor.start();
};
