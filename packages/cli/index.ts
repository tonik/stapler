#!/usr/bin/env node
import fs from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { createProject } from 'stplr-core';
import { checkAuthentication } from './utils/checkAuthentication';
import { checkTools } from './utils/checkTools';
import { findUnfinishedProjects, UnfinishedProject } from './utils/findUnfinishedProjects';

const asciiArt = `
.&&&%                                                         &&&&                                    
.&&&%                                                         &&&&                                    
.&&&&&&&&*    (&&&&&&&&&&*      (&&&.&&&&&&&&&&      *&&&#    &&&&     #&&&&,                         
.&&&&((((,  %&&&&(, .,#&&&&#    (&&&&&%(**(%&&&&(    *&&&#    &&&&   (&&&%                            
.&&&%      %&&&.        ,&&&%   (&&&/        &&&&.   *&&&#    &&&& #&&&#                              
.&&&%     ,&&&*          (&&&.  (&&&/        %&&&,   *&&&#    &&&&&&&&&&.                             
.&&&%      %&&&.        *&&&#   (&&&/        %&&&,   *&&&#    &&&&&* *&&&%                            
.&&&%       %&&&&%.  ,&&&&&#    (&&&/        %&&&,   *&&&#    &&&&     #&&&/                          
.&&&%         (&&&&&&&&&%*      (&&&/        %&&&,   *&&&#    &&&&      .&&&&,                        
`;

const displayHeader = () => {
  const metalGradient = gradient([
    { color: '#3C3C3C', pos: 0 },
    { color: '#FFFFFF', pos: 1 },
  ]);

  console.log(metalGradient(asciiArt));
  console.log(chalk.bold('\nWelcome to Stapler!\n'));
};

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

interface Flags {
  local?: boolean;
  name?: string;
  skipPayload?: boolean;
}

const createAction = async (options: Flags) => {
  const shouldDeploy = !options.local;
  const currentDir = process.cwd();
  const unfinishedProjects: UnfinishedProject[] = findUnfinishedProjects(currentDir);
  let selectedProject: UnfinishedProject | null = null;
  let proceedWithNewProject = true;

  if (!options.name && unfinishedProjects.length > 0) {
    const projectChoices = unfinishedProjects.map((proj) => ({
      name: proj.projectName,
      value: proj,
    }));

    const resumeAnswers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'resume',
        message: `We found the following unfinished project(s):\n${unfinishedProjects
          .map((p) => `- ${p.projectName}`)
          .join('\n')}\nWould you like to resume one of them?`,
        default: true,
      },
      {
        type: 'list',
        name: 'selectedProject',
        message: 'Select a project to resume:',
        choices: projectChoices,
        when: (answers) => answers.resume && unfinishedProjects.length > 1,
      },
    ]);

    if (resumeAnswers.resume) {
      proceedWithNewProject = false;
      if (unfinishedProjects.length === 1) {
        selectedProject = unfinishedProjects[0];
      } else {
        selectedProject = resumeAnswers.selectedProject || null;
      }
    }
  }

  if (!proceedWithNewProject && selectedProject) {
    process.chdir(selectedProject.projectPath);
    selectedProject.state.options.name = selectedProject.projectName;

    if (shouldDeploy) {
      await checkAuthentication();
      await checkTools();
    }

    await createProject(selectedProject.state.options, selectedProject.projectPath).catch((error) => {
      console.error('Error resuming project:', error);
    });
  } else {
    // Create new project
    options.name &&
      console.log('You have provided a project name of:', chalk.yellow(options.name), "let's continue...");

    const projectName =
      options.name ||
      (
        await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'What is your project named?',
            default: 'my-stapled-app',
          },
        ])
      ).name;

    const projectDir = `${currentDir}/${projectName}`;
    // Check if the directory already exists
    if (fs.existsSync(projectDir)) {
      const overwriteAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `The directory "${projectName}" already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);

      if (!overwriteAnswer.overwrite) {
        console.log(chalk.red('Project creation canceled. Project directory already exists.'));
        return;
      }

      // Clear the directory if overwrite is confirmed
      fs.rmSync(projectDir, { recursive: true, force: true });
      console.log(chalk.yellow(`The directory "${projectName}" has been cleared.`));
    }

    // Skip Payload if specified by the flag
    const payloadAnswer = options.skipPayload
      ? { usePayload: false }
      : await inquirer.prompt([
          {
            type: 'confirm',
            name: 'usePayload',
            message: 'Would you like to add Payload to your app?',
            default: true,
          },
        ]);

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
