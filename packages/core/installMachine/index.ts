import { ActorLogic, AnyEventObject, PromiseSnapshot, and, createActor, createMachine, fromPromise, not } from 'xstate';

import { InstallMachineContext, StepsCompleted } from '../types';
import { saveStateToRcFile } from '../utils/rcFileManager';
import { initializeRepository, pushToGitHub } from './installSteps/github';
import { modifyHomepage } from './installSteps/homepage';
import { preparePayload } from './installSteps/payload';
import { prettify } from './installSteps/prettier';
import { createDocFiles, modifyGitignore, prepareDrink } from './installSteps/stapler';
import { connectSupabaseProject, createSupabaseProject, installSupabase } from './installSteps/supabase';
import { installTailwind } from './installSteps/tailwind';
import { createTurbo } from './installSteps/turbo';
import {
  chooseVercelTeam,
  deployVercelProject,
  linkVercelProject,
  updateVercelProjectSettings,
} from './installSteps/vercel';
import { shouldDeploy } from './installSteps/shouldDeploy';

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
      initial: 'createTurbo',
      context: initialContext,
      states: {
        createTurbo: {
          always: [
            {
              guard: isStepCompleted('createTurbo'),
              target: 'modifyGitignore',
            },
          ],
          invoke: {
            src: 'createTurboActor',
            input: ({ context }) => context,
            onDone: 'modifyGitignore',
            onError: 'failed',
          },
        },
        modifyGitignore: {
          always: [
            {
              guard: isStepCompleted('modifyGitignore'),
              target: 'installTailwind',
            },
          ],
          invoke: {
            src: 'modifyGitignoreActor',
            input: ({ context }) => context,
            onDone: 'installTailwind',
            onError: 'failed',
          },
        },
        installTailwind: {
          always: [
            {
              guard: isStepCompleted('installTailwind'),
              target: 'modifyHomepage',
            },
          ],
          invoke: {
            src: 'installTailwindActor',
            input: ({ context }) => context,
            onDone: 'modifyHomepage',
            onError: 'failed',
          },
        },
        modifyHomepage: {
          always: [
            {
              guard: isStepCompleted('modifyHomepage'),
              target: 'installSupabase',
            },
          ],
          invoke: {
            src: 'modifyHomepageActor',
            input: ({ context }) => context,
            onDone: 'installSupabase',
            onError: 'failed',
          },
        },
        installSupabase: {
          always: [
            {
              guard: and([
                isStepCompleted('installSupabase'),
                not(isStepCompleted('installPayload')),
                'shouldInstallPayload',
              ]),
              target: 'installPayload',
            },
            {
              guard: isStepCompleted('installSupabase'),
              target: 'createDocFiles',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'installSupabaseActor',
            onDone: [
              {
                guard: and(['shouldInstallPayload', not(isStepCompleted('installPayload'))]),
                target: 'installPayload',
              },
              { target: 'createDocFiles' },
            ],
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
              target: 'shouldDeploy',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'prettifyCodeActor',
            onDone: 'shouldDeploy',
            onError: 'failed',
          },
        },
        shouldDeploy: {
          invoke: {
            input: ({ context }) => context,
            src: 'shouldDeployActor',
            onDone: [
              {
                guard: 'shouldDeploy',
                target: 'initializeRepository',
              },
              {
                target: 'prepareDrink',
              },
            ],
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
              target: 'chooseVercelTeam',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'createSupabaseProjectActor',
            onDone: 'chooseVercelTeam',
            onError: 'failed',
          },
        },
        chooseVercelTeam: {
          always: [
            {
              guard: isStepCompleted('chooseVercelTeam'),
              target: 'linkVercelProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'chooseVercelTeamActor',
            onDone: 'linkVercelProject',
            onError: 'failed',
          },
        },
        linkVercelProject: {
          always: [
            {
              guard: isStepCompleted('linkVercelProject'),
              target: 'updateVercelProjectSettings',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'linkVercelProjectActor',
            onDone: 'updateVercelProjectSettings',
            onError: 'failed',
          },
        },
        updateVercelProjectSettings: {
          always: [
            {
              guard: isStepCompleted('updateVercelProjectSettings'),
              target: 'connectSupabaseProject',
            },
          ],
          invoke: {
            input: ({ context }) => context,
            src: 'updateVercelProjectSettingsActor',
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
        shouldDeploy: ({ context }) => {
          return context.stateData.options.shouldDeploy;
        },
      },
      actors: {
        createTurboActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await createTurbo(input.stateData.options.name);
              process.chdir(input.projectDir);
              input.stateData.stepsCompleted.createTurbo = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createTurboActor:', error);
              throw error;
            }
          }),
        ),
        modifyGitignoreActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await modifyGitignore('.initializeRcFile');
              input.stateData.stepsCompleted.modifyGitignore = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in modifyGitignoreActor:', error);
              throw error;
            }
          }),
        ),
        installTailwindActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const currentDir = process.cwd();
              await installTailwind(currentDir);
              input.stateData.stepsCompleted.installTailwind = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in installTailwindActor:', error);
              throw error;
            }
          }),
        ),
        modifyHomepageActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await modifyHomepage(input.projectDir);
              input.stateData.stepsCompleted.modifyHomepage = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in modifyHomepageActor:', error);
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
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in installSupabaseActor:', error);
              throw error;
            }
          }),
        ),
        installPayloadActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await preparePayload();
              input.stateData.stepsCompleted.installPayload = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in installPayloadActor:', error);
              throw error;
            }
          }),
        ),
        createDocFilesActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await createDocFiles();
              input.stateData.stepsCompleted.createDocFiles = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createDocFilesActor:', error);
              throw error;
            }
          }),
        ),
        prettifyCodeActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await prettify();
              input.stateData.stepsCompleted.prettifyCode = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in prettifyCodeActor:', error);
              throw error;
            }
          }),
        ),
        shouldDeployActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const shouldContinue = await shouldDeploy(input.stateData.options.shouldDeploy);
              input.stateData.options.shouldDeploy = shouldContinue;
            } catch (error) {
              console.error('Error in shouldDeployActor:', error);
              throw error;
            }
          }),
        ),
        initializeRepositoryActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await initializeRepository({
                projectName: input.stateData.options.name,
                stateData: input.stateData,
              });
              input.stateData.stepsCompleted.initializeRepository = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in initializeRepositoryActor:', error);
              throw error;
            }
          }),
        ),
        pushToGitHubActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await pushToGitHub(input.stateData.selectedAccount, input.stateData.githubCandidateName);
              input.stateData.stepsCompleted.pushToGitHub = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in pushToGitHubActor:', error);
              throw error;
            }
          }),
        ),
        createSupabaseProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await createSupabaseProject(input.stateData.githubCandidateName);
              input.stateData.stepsCompleted.createSupabaseProject = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in createSupabaseProjectActor:', error);
              throw error;
            }
          }),
        ),
        chooseVercelTeamActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await chooseVercelTeam();
              input.stateData.stepsCompleted.chooseVercelTeam = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in chooseVercelTeamActor:', error);
              throw error;
            }
          }),
        ),
        linkVercelProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await linkVercelProject(input.stateData.githubCandidateName);
              input.stateData.stepsCompleted.linkVercelProject = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in linkVercelProjectActor:', error);
              throw error;
            }
          }),
        ),
        updateVercelProjectSettingsActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await updateVercelProjectSettings();
              input.stateData.stepsCompleted.updateVercelProjectSettings = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in updateVercelProjectSettingsActor:', error);
              throw error;
            }
          }),
        ),
        connectSupabaseProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const currentDir = process.cwd();
              await connectSupabaseProject(input.stateData.githubCandidateName, currentDir);
              input.stateData.stepsCompleted.connectSupabaseProject = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in connectSupabaseProjectActor:', error);
              throw error;
            }
          }),
        ),
        deployVercelProjectActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              await deployVercelProject(input.stateData);
              input.stateData.stepsCompleted.deployVercelProject = true;
              saveStateToRcFile(input.stateData, input.projectDir);
            } catch (error) {
              console.error('Error in deployVercelProjectActor:', error);
              throw error;
            }
          }),
        ),
        prepareDrinkActor: createStepMachine(
          fromPromise<void, InstallMachineContext, AnyEventObject>(async ({ input }) => {
            try {
              const {
                projectName,
                prettyDeploymentUrl,
                options: { shouldDeploy },
              } = input.stateData;
              prepareDrink(projectName, prettyDeploymentUrl, shouldDeploy);
              if (shouldDeploy) {
                input.stateData.stepsCompleted.shouldDeploy = true;
                input.stateData.stepsCompleted.prepareDrink = true;
              }
              saveStateToRcFile(input.stateData, input.projectDir);
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

export const installMachine = (context: InstallMachineContext) => {
  const installMachine = createInstallMachine(context);
  const installActor = createActor(installMachine);

  return installActor;
};
