import { execSync } from 'child_process';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { prepareDrink } from './utils/bar/prepareDrink';
import { pushToGitHub } from './utils/github/repositoryManager';
import { ProjectOptions, StaplerState } from './types';
import { initializeState, saveState } from './utils/stateManager/stateManager';
import { initializeRepository } from './utils/github/install';

export async function createProject(options: ProjectOptions, projectDir: string) {
  const { name, usePayload } = options;

  let state: StaplerState;

  state = initializeState(projectDir);
  state.projectName = name;
  state.options = options;

  if (!state.stepsCompleted.initializeProject) {
    console.log(`🍸 Stapling ${name}...`);
    execSync(`npx create-turbo@latest ${name} -m pnpm`, {
      stdio: 'inherit',
    });
    state.stepsCompleted.initializeProject = true;
    saveState(state, projectDir);
  }

  process.chdir(projectDir);
  const currentDir = process.cwd();

  if (!state.stepsCompleted.createEnvFile) {
    console.log('Creating .env file...');
    createEnvFile(currentDir);
    state.stepsCompleted.createEnvFile = true;
    saveState(state, projectDir);
  }

  if (usePayload && !state.stepsCompleted.installPayload) {
    console.log('Installing payload...');
    await preparePayload();
    state.stepsCompleted.installPayload = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.installSupabase) {
    console.log('Installing Supabase...');
    await installSupabase(projectDir);
    state.stepsCompleted.installSupabase = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.prettifyCode) {
    console.log('Prettifying code...');
    await prettify();
    state.stepsCompleted.prettifyCode = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.initializeRepository) {
    console.log('Initializing repository...');
    initializeRepository({
      projectName: name,
      visibility: 'private',
    })
      .then(() => {
        state.stepsCompleted.initializeRepository = true;
        saveState(state, projectDir);
      })
      .catch((error) => {
        console.error('Error initializing repository:', error);
        state.stepsCompleted.initializeRepository = false;
        saveState(state, projectDir);
      });
  }

  if (!state.stepsCompleted.pushToGitHub) {
    console.log('Pushing to GitHub...');
    pushToGitHub();
    state.stepsCompleted.pushToGitHub = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.prepareDrink) {
    console.log('Preparing drink...');
    prepareDrink(name);
    state.stepsCompleted.prepareDrink = true;
    saveState(state, projectDir);
  }
}
