#!/usr/bin/env node
import fs from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { createProject } from 'stplr-core';
import { checkAuthentication } from './utils/checkAuthentication';
import { checkTools } from './utils/checkTools';
import { findUnfinishedProjects, getProjectChoices, UnfinishedProject } from './utils/findUnfinishedProjects';
import { unfinishedProjectsChoice } from './command-prompts/unfinishedProjectsChoicePrompt';
import { overwriteDirectoryPrompt } from './command-prompts/overwriteDirectoryPrompt';
import { shouldUsePayloadPrompt } from './command-prompts/shouldUsePayloadPrompt';
import { displayHeader } from './utils/displayHeader';
import { getProjectNamePrompt } from './command-prompts/getProjectNamePrompt';

interface Flags {
  local?: boolean;
  name?: string;
  skipPayload?: boolean;
}

const program = new Command();

program
  .name('stplr')
  .description(
    'CLI tool to bootstrap an app with a variety of integrated steps. This tool guides you through the entire process of initializing, configuring, and deploying a new project.',
  )
  .version('0.1.0')
  .hook('preAction', () => {
    displayHeader();
  })
  .option(
    '-l, --local',
    'Setup project locally without creating github repository, supabase project and vercel deployment',
  )
  .option('-n, --name <name>', 'Set the name of the project')
  .option('--skip-payload', 'Skip adding Payload to the app');

program.parse(process.argv);

const createAction = async (options: Flags) => {
  const shouldDeploy = !options.local;
  const currentDir = process.cwd();

  let proceedWithNewProject = true;
  let selectedProject: UnfinishedProject | null = null;

  const unfinishedProjects: UnfinishedProject[] = findUnfinishedProjects(currentDir);

  // If no project name is provided, and there are unfinished projects, we prompt the user to resume one of them
  if (!options.name && unfinishedProjects.length > 0) {
    const projectChoices = getProjectChoices(unfinishedProjects);

    const { resume, unfinishedSelectedProject } = await unfinishedProjectsChoice(unfinishedProjects, projectChoices);

    if (resume) {
      proceedWithNewProject = false;
      if (unfinishedProjects.length === 1) {
        selectedProject = unfinishedProjects[0];
      } else {
        selectedProject = unfinishedSelectedProject || null;
      }
    }
  }

  // resume selected project
  if (!proceedWithNewProject && selectedProject) {
    process.chdir(selectedProject.projectPath);
    selectedProject.state.options.name = selectedProject.projectName;

    if (shouldDeploy) {
      await checkAuthentication();
      await checkTools();
    }

    await createProject({ ...selectedProject.state.options, shouldDeploy }, selectedProject.projectPath).catch(
      (error) => {
        console.error('Error resuming project:', error);
      },
    );
  } else {
    // Create new project
    options.name &&
      console.log('You have provided a project name of:', chalk.yellow(options.name), "let's continue...");

    const projectName = options.name || (await getProjectNamePrompt());

    const projectDir = `${currentDir}/${projectName}`;
    const directoryExists = fs.existsSync(projectDir);

    if (directoryExists) {
      const shouldOverwrite = (await overwriteDirectoryPrompt(projectName)).overwrite;

      if (shouldOverwrite === false) {
        console.log(chalk.red('Project creation canceled. Project directory already exists.'));
        return;
      }

      // Clear the directory if overwrite is confirmed
      fs.rmSync(projectDir, { recursive: true, force: true });
      console.log(chalk.yellow(`The directory "${projectName}" has been cleared.`));
    }

    // Skip Payload if specified by the flag
    const payloadAnswer = options.skipPayload ? { usePayload: false } : await shouldUsePayloadPrompt();

    const finalOptions = { name: projectName, shouldDeploy: !options.local, ...payloadAnswer };
    if (shouldDeploy) {
      await checkAuthentication();
      await checkTools();
    }

    await createProject(finalOptions, projectDir).catch((error) => {
      console.error(chalk.red('Error creating project:', error));
    });
  }
};

program
  .command('create', { isDefault: true })
  .description(
    'CLI tool to bootstrap an app with a variety of integrated steps. This tool guides you through the entire process of initializing, configuring, and deploying a new project.',
  )
  .action(() => createAction(program.opts()));

program.parse();
