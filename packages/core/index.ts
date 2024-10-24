import { assign, createMachine, createActor, fromPromise } from 'xstate';
import { ProjectOptions, StaplerState, StepsCompleted } from './types';
import { initializeState, saveState } from './utils/stateManager/stateManager';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { initializeRepository } from './utils/github/install';
import { pushToGitHub } from './utils/github/repositoryManager';
import { prepareDrink } from './utils/bar/prepareDrink';
import { execSync } from 'child_process';

type ContextType = {
  projectDir: string;
  stateData: StaplerState;
  stepsOrder: (keyof StepsCompleted)[];
  currentStepIndex: number;
};

type Event =
  | { type: 'NEXT' }
  | { type: 'STEP_COMPLETED'; data: { step: keyof StepsCompleted; stateData: StaplerState } }
  | { type: 'ERROR'; error: any };

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
            console.log(`🖇️  Step "${step}" skipped and marked as completed.`);
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
          console.log('🖇️ Checking if all steps are completed...');
          return context.currentStepIndex >= context.stepsOrder.length;
        },
        currentStepCompleted: ({ context }) => {
          const step = context.stepsOrder[context.currentStepIndex];
          console.log(`🖇️ Checking if step "${step}" is completed...`);
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
          console.log(`🖇️ Performing step: ${step}`);

          try {
            switch (step) {
              case 'initializeProject':
                input.stateData = initializeState(input.projectDir, input.stateData.projectName);
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
              case 'prettifyCode':
                prettify();
                break;
              case 'initializeRepository':
                const { projectName } = input.stateData;
                console.log(`🖇️ Initializing repository in our switch call`);
                await initializeRepository({
                  projectName,
                  visibility: 'private',
                });
                break;
              case 'pushToGitHub':
                await pushToGitHub(input.projectDir);
                console.log('🖇️ Changes pushed to GitHub!');
                break;
              case 'prepareDrink':
                prepareDrink(input.stateData.projectName);
                break;
              default:
                throw new Error(`Unknown step: ${step}`);
            }

            input.stateData.stepsCompleted[step] = true;
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

export async function createProject(options: ProjectOptions, projectDir: string) {
  const { name } = options;

  let state: StaplerState = initializeState(projectDir, name);
  state.options = options;

  if (state.stepsCompleted.initializeProject) {
    console.log(`🖇️ Project "${name}" already initialized.`);
  } else {
    console.log(`🖇️ Stapling ${name}...`);
    execSync(`npx create-turbo@latest ${name} -m pnpm`, {
      stdio: 'inherit',
    });
    process.chdir(name);
  }

  const currentDir = process.cwd();

  const stepsOrder: (keyof StepsCompleted)[] = [
    'initializeProject',
    'createEnvFile',
    'installPayload',
    'installSupabase',
    'prettifyCode',
    'initializeRepository',
    'pushToGitHub',
    'prepareDrink',
  ];

  const context: ContextType = {
    projectDir: currentDir,
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
}
