import { createMachine, fromPromise, createActor, ActorLogic, AnyEventObject, PromiseSnapshot, and, not } from 'xstate';

import { ProjectOptions, StaplerState, StepsCompleted } from './types';
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
import { setupDatabaseWithDocker } from './utils/supabase/setupDatabaseWithDocker';

interface InstallMachineContext {
  type: 'install';
  projectDir: string;
  stateData: StaplerState;
}

const isStepCompleted = (stepName: keyof StepsCompleted) => {
  return ({ context }: { context: InstallMachineContext; event: AnyEventObject }) => {
    return context.stateData.stepsCompleted[stepName] === true;
  };
};

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
          always: [
            {
              guard: isStepCompleted('initializeProject'),
              target: 'createEnvFile',
            },
          ],
          invoke: {
            src: 'initializeProjectActor',
            input: ({ context }) => context,
            onDone: 'createEnvFile',
            onError: 'failed',
          },
        },
        createEnvFile: {
          always: [
            {
              guard: isStepCompleted('createEnvFile'),
              target: 'installSupabase',
            },
          ],
          invoke: {
            src: 'createEnvFileActor',
            input: ({ context }) => context,
            onDone: 'installSupabase',
            onError: 'failed',
          },
        },
        installSupabase: {
          always: [
            {
              guard: isStepCompleted('installSupabase'),
              target: 'setupDatabaseWithDocker',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'installSupabaseActor',
            onDone: 'setupDatabaseWithDocker',
            onError: 'failed',
          },
        },
        setupDatabaseWithDocker: {
          always: [
            {
              guard: and([isStepCompleted('setupDatabaseWithDocker'), 'shouldInstallPayload']),
              target: 'installPayload',
            },
            {
              guard: isStepCompleted('setupDatabaseWithDocker'),
              target: 'createDocFiles',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'setupDatabaseWithDockerActor',
            onDone: [{ guard: 'shouldInstallPayload', target: 'installPayload' }, { target: 'createDocFiles' }],
            onError: 'failed',
          },
        },
        installPayload: {
          always: [
            {
              guard: and([isStepCompleted('installPayload'), not('shouldInstallPayload')]),
              target: 'createDocFiles',
            },
          ],
          invoke: {
            src: 'installPayloadActor',
            input: ({ context }) => context,
            onDone: 'createDocFiles',
            onError: 'failed',
          },
        },
        createDocFiles: {
          always: [
            {
              guard: isStepCompleted('createDocFiles'),
              target: 'prettifyCode',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'createDocFilesActor',
            onDone: 'prettifyCode',
            onError: 'failed',
          },
        },
        prettifyCode: {
          always: [
            {
              guard: isStepCompleted('prettifyCode'),
              target: 'initializeRepository',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'prettifyCodeActor',
            onDone: 'initializeRepository',
            onError: 'failed',
          },
        },
        initializeRepository: {
          always: [
            {
              guard: isStepCompleted('initializeRepository'),
              target: 'pushToGitHub',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'initializeRepositoryActor',
            onDone: 'pushToGitHub',
            onError: 'failed',
          },
        },
        pushToGitHub: {
          always: [
            {
              guard: isStepCompleted('pushToGitHub'),
              target: 'createSupabaseProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'pushToGitHubActor',
            onDone: 'createSupabaseProject',
            onError: 'failed',
          },
        },
        createSupabaseProject: {
          always: [
            {
              guard: isStepCompleted('createSupabaseProject'),
              target: 'setupAndCreateVercelProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'createSupabaseProjectActor',
            onDone: 'setupAndCreateVercelProject',
            onError: 'failed',
          },
        },
        setupAndCreateVercelProject: {
          always: [
            {
              guard: isStepCompleted('setupAndCreateVercelProject'),
              target: 'connectSupabaseProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'setupAndCreateVercelProjectActor',
            onDone: 'connectSupabaseProject',
            onError: 'failed',
          },
        },
        connectSupabaseProject: {
          always: [
            {
              guard: isStepCompleted('connectSupabaseProject'),
              target: 'deployVercelProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'connectSupabaseProjectActor',
            onDone: 'deployVercelProject',
            onError: 'failed',
          },
        },
        deployVercelProject: {
          always: [
            {
              guard: isStepCompleted('deployVercelProject'),
              target: 'prepareDrink',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'deployVercelProjectActor',
            onDone: 'prepareDrink',
            onError: 'failed',
          },
        },
        prepareDrink: {
          always: [
            {
              guard: isStepCompleted('prepareDrink'),
              target: 'done',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'prepareDrinkActor',
            onDone: 'done',
            onError: 'failed',
          },
        },
        done: {
          type: 'final',
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
              createEnvFile(input.projectDir);
              input.stateData.stepsCompleted.createEnvFile = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createEnvFileActor:', error);
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
        setupDatabaseWithDockerActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              setupDatabaseWithDocker();
              input.stateData.stepsCompleted.setupDatabaseWithDocker = true;
              saveState(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in setupDatabaseWithDockerActor:', error);
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

  const context: InstallMachineContext = {
    type: 'install',
    projectDir: projectDir,
    stateData: state,
  };

  const installMachine = createInstallMachine(context);
  const installActor = createActor(installMachine);

  installActor.start();
};
