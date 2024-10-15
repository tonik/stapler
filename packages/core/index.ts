import { execSync } from 'child_process';
import { createEnvFile } from './utils/env/createEnvFile';
import { preparePayload } from './utils/payload/install';
import { installSupabase } from './utils/supabase/install';
import { prettify } from './utils/prettier/prettify';
import { prepareDrink } from './utils/bar/prepareDrink';
import { initializeRepository } from './utils/github/install';
import { ProjectOptions, StaplerState } from './types';
import { initializeState, saveState } from './utils/stateManager/stateManager';

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

  process.chdir(name);
  const currentDir = process.cwd();

  if (!state.stepsCompleted.createEnvFile) {
    createEnvFile(currentDir);
    state.stepsCompleted.createEnvFile = true;
    saveState(state, projectDir);
  }

  if (usePayload && !state.stepsCompleted.installPayload) {
    await preparePayload();
    state.stepsCompleted.installPayload = true;
    saveState(state, projectDir);
  } else if (state.stepsCompleted.installPayload) {
    return;
  }

  if (!state.stepsCompleted.installSupabase) {
    await installSupabase(projectDir);
    state.stepsCompleted.installSupabase = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.prettifyCode) {
    await prettify();
    state.stepsCompleted.prettifyCode = true;
    saveState(state, projectDir);
  }

  if (!state.stepsCompleted.initializeRepository) {
    await initializeRepository({
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

  if (!state.stepsCompleted.prepareDrink) {
    prepareDrink(name);
    state.stepsCompleted.prepareDrink = true;
    saveState(state, projectDir);
  }
}
