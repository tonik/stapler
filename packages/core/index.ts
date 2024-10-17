import { assign, createActor, fromPromise, setup } from 'xstate';
import { ProjectOptions, StaplerState, StepsCompleted } from './types';
import { initializeState, saveState } from './utils/stateManager/stateManager';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { initializeRepository } from './utils/github/install';
import { createGitHubRepository, pushToGitHub } from './utils/github/repositoryManager';
import { prepareDrink } from './utils/bar/prepareDrink';
import { execSync } from 'child_process';

type ContextType = {
  projectDir: string;
  stateData: StaplerState;
};

type Event = { type: 'NEXT' };

const createInstallMachine = (initialContext: ContextType) => {
  return setup({
    types: {} as {
      context: ContextType;
      events: Event;
    },
    actors: {
      initializeRepository: fromPromise(async ({ input }: { input: ContextType }) => {
        const { projectName, options } = input.stateData;
        console.log(`🖇️ Creating GitHub repository: ${projectName}`);
        return await initializeRepository({ projectName, visibility: 'private' });
      }),
    },
    actions: {
      performStep: assign({
        stateData: ({ context }, { step }: { step: keyof StepsCompleted }) => {
          console.log(`🖇️ Performing step: ${step}`);
          let updatedStateData = { ...context.stateData };

          switch (step) {
            case 'initializeProject':
              updatedStateData = initializeState(context.projectDir);
              break;
            case 'createEnvFile':
              createEnvFile(context.projectDir);
              break;
            case 'installPayload':
              preparePayload();
              break;
            case 'installSupabase':
              installSupabase(context.projectDir);
              break;
            case 'prettifyCode':
              prettify();
              break;
            case 'pushToGitHub':
              async () =>
                await pushToGitHub(context.projectDir)
                  .then(() => {
                    console.log('🖇️ Changes pushed to GitHub!');
                  })
                  .catch((error) => {
                    console.error('🖇️ Error pushing changes to GitHub:', error);
                  });
              break;
            case 'prepareDrink':
              prepareDrink(context.stateData.projectName);
              break;
          }

          updatedStateData.stepsCompleted[step] = true;
          saveState(updatedStateData, context.projectDir);
          return updatedStateData;
        },
      }),
    },
    guards: {
      isStepNeeded: ({ context }, { step }: { step: keyof StepsCompleted }) => {
        if (step === 'installPayload') {
          return context.stateData.options.usePayload && !context.stateData.stepsCompleted[step];
        }
        return !context.stateData.stepsCompleted[step];
      },
    },
  }).createMachine({
    id: 'installProcess',
    initial: 'initializeProject',
    context: initialContext,
    states: {
      initializeProject: {
        entry: { type: 'performStep', params: { step: 'initializeProject' } },
        on: { NEXT: 'createEnvFile' },
      },
      createEnvFile: {
        entry: { type: 'performStep', params: { step: 'createEnvFile' } },
        on: { NEXT: 'installPayload' },
      },
      installPayload: {
        entry: { type: 'performStep', params: { step: 'installPayload' } },
        on: { NEXT: 'installSupabase' },
      },
      installSupabase: {
        entry: { type: 'performStep', params: { step: 'installSupabase' } },
        on: { NEXT: 'prettifyCode' },
      },
      prettifyCode: {
        entry: { type: 'performStep', params: { step: 'prettifyCode' } },
        on: { NEXT: 'initializeRepository' },
      },
      initializeRepository: {
        invoke: {
          src: 'initializeRepository',
          input: ({ context, event }) => ({
            projectDir: context.projectDir,
            stateData: context.stateData,
          }),
          onDone: { target: 'pushToGitHub' },
          onError: { target: 'failed' },
        },
      },
      pushToGitHub: {
        entry: { type: 'performStep', params: { step: 'pushToGitHub' } },
        on: { NEXT: 'prepareDrink' },
      },
      prepareDrink: {
        entry: { type: 'performStep', params: { step: 'prepareDrink' } },
        on: { NEXT: 'done' },
      },
      done: {
        type: 'final',
      },
      failed: {
        type: 'final',
        entry: () => console.log('Installation process encountered an error and stopped.'),
      },
    },
  });
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
  }

  process.chdir(name);

  const currentDir = process.cwd();

  const context: ContextType = {
    projectDir: currentDir,
    stateData: state,
  };
  const installMachine = createInstallMachine(context);
  const installActor = createActor(installMachine);

  installActor.subscribe((state) => {
    if (state.matches('done')) {
      console.log('Installation process completed!');
    } else {
      // Send NEXT event to move to the next state
      installActor.send({ type: 'NEXT' });
    }
  });

  installActor.start();
}
