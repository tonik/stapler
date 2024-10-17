import { assign, createActor, setup } from 'xstate';
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
};

type Event = { type: 'NEXT' };

const createInstallMachine = (initialContext: ContextType) => {
  return setup({
    types: {} as {
      context: ContextType;
      events: Event;
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
            case 'initializeRepository':
              initializeRepository({
                projectName: context.stateData.projectName,
                visibility: 'private',
              });
              break;
            case 'pushToGitHub':
              pushToGitHub(context.projectDir);
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
        entry: { type: 'performStep', params: { step: 'initializeRepository' } },
        on: { NEXT: 'pushToGitHub' },
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
    },
  });
};

export async function createProject(options: ProjectOptions, projectDir: string) {
  let state: StaplerState = initializeState(projectDir);
  const { name } = options;
  state.options = options;

  console.log(`🖇️ Stapling ${name}...`);
  execSync(`npx create-turbo@latest ${name} -m pnpm`, {
    stdio: 'inherit',
  });
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
