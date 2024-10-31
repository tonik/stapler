import { assign, createMachine, createActor, fromPromise } from 'xstate';
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

type ContextType = {
  projectDir: string;
  stateData: StaplerState;
  stepsOrder: (keyof StepsCompleted)[];
  currentStepIndex: number;
};

const createInstallMachine = (initialContext: ContextType) => {
  return createMachine(
    {
      id: 'installProcess',
      initial: 'checkNextStep',
      context: initialContext,
      states: {
        checkNextStep: {
          always: [
            {
              guard: 'allStepsCompleted',
              target: 'done',
            },
            {
              guard: 'currentStepCompleted',
              actions: 'incrementStepIndex',
              target: 'checkNextStep',
            },
            {
              guard: 'shouldSkipCurrentStep',
              actions: ['markStepAsCompleted', 'incrementStepIndex'],
              target: 'checkNextStep',
            },
            { target: 'executeStep' },
          ],
        },
        executeStep: {
          invoke: {
            src: 'performStep',
            id: 'performStepActor',
            input: ({ context }) => context,
            onDone: {
              actions: ['updateContext', 'incrementStepIndex'],
              target: 'checkNextStep',
            },
            onError: {
              actions: 'handleError',
              target: 'failed',
            },
          },
        },
        done: {
          type: 'final',
        },
        failed: {
          type: 'final',
          entry: () => console.log('Installation process encountered an error and stopped.'),
        },
      },
    },
    {
      actions: {
        incrementStepIndex: assign({
          currentStepIndex: ({ context }) => context.currentStepIndex + 1,
        }),
        updateContext: assign({
          stateData: ({ context, event }) => {
            if (event.type === 'STEP_COMPLETED' || event.type === 'done.invoke.performStepActor') {
              return event.data.stateData;
            }
            return context.stateData;
          },
        }),
        markStepAsCompleted: assign({
          stateData: ({ context }) => {
            const step = context.stepsOrder[context.currentStepIndex];
            context.stateData.stepsCompleted[step] = true;
            saveState(context.stateData, context.projectDir);
            return context.stateData;
          },
        }),
        handleError: ({ context, event }) => {
          console.log('Installation process stopped. Event: ', event);
          console.error('Error in performStep:', event.data);
          if (event.type === 'error.platform.performStepActor') {
            console.error('Error in performStep:', event.data);
          }
        },
      },
      guards: {
        allStepsCompleted: ({ context }) => {
          return context.currentStepIndex >= context.stepsOrder.length;
        },
        currentStepCompleted: ({ context }) => {
          const step = context.stepsOrder[context.currentStepIndex];
          return context.stateData.stepsCompleted[step];
        },
        shouldSkipCurrentStep: ({ context }) => {
          const step = context.stepsOrder[context.currentStepIndex];
          if (step === 'installPayload' && !context.stateData.options.usePayload) {
            console.log(`🖇️ Skipping step "${step}" as it is optional and not selected.`);
            return true;
          }
          return false;
        },
      },
      actors: {
        performStep: fromPromise(async ({ input }: { input: ContextType }) => {
          const step = input.stepsOrder[input.currentStepIndex];
          const { options, projectName, stepsCompleted } = input.stateData;
          console.log(`🖇️ Performing step: ${step}`);

          try {
            switch (step) {
              case 'initializeProject':
                const { name } = options;
                console.log(`🖇️ Stapling ${name}...`);
                await createTurboRepo(name);
                process.chdir(name);
                break;
              case 'createEnvFile':
                createEnvFile(input.projectDir);
                break;
              case 'installPayload':
                preparePayload();
                break;
              case 'installSupabase':
                installSupabase(input.projectDir);
                break;
              case 'createDocFiles':
                createDocFiles();
                break;
              case 'prettifyCode':
                prettify();
                break;
              case 'initializeRepository':
                await initializeRepository({
                  projectName,
                  visibility: 'private',
                });
                break;
              case 'pushToGitHub':
                await pushToGitHub(projectName);
                break;
              case 'createSupabaseProject':
                await createSupabaseProject(projectName);
                break;
              case 'setupAndCreateVercelProject':
                await setupAndCreateVercelProject();
                break;
              case 'connectSupabaseProject':
                await connectSupabaseProject(projectName, input.projectDir);
                break;
              case 'deployVercelProject':
                await deployVercelProject();
                break;
              case 'prepareDrink':
                prepareDrink(projectName);
                break;
              default:
                throw new Error(`Unknown step: ${step}`);
            }

            stepsCompleted[step] = true;
            saveState(input.stateData, input.projectDir);
            console.log(`🖇️ Step "${step}" completed.`);

            // Return the updated stateData and step
            return { step, stateData: input.stateData };
          } catch (error) {
            console.error(`🖇️ Error performing step "${step}":`, error);
            throw error;
          }
        }),
      },
    },
  );
};

export const createProject = async (options: ProjectOptions, projectDir: string) => {
  const { name, usePayload } = options;

  let state: StaplerState = initializeState(projectDir, name, usePayload);
  state.options = options;

  const stepsOrder: (keyof StepsCompleted)[] = [
    'initializeProject',
    'createEnvFile',
    'installPayload',
    'installSupabase',
    'createDocFiles',
    'prettifyCode',
    'initializeRepository',
    'createSupabaseProject',
    'setupAndCreateVercelProject',
    'connectSupabaseProject',
    'deployVercelProject',
    'prepareDrink',
  ];

  const context: ContextType = {
    projectDir,
    stateData: state,
    stepsOrder,
    currentStepIndex: 0,
  };

  const installMachine = createInstallMachine(context);
  const installActor = createActor(installMachine);

  installActor.subscribe((state) => {
    if (state.matches('done')) {
      console.log('Installation process completed!');
    } else if (state.matches('failed')) {
      console.log('Installation process failed.');
    }
  });

  installActor.start();
};
