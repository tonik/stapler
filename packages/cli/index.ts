#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';

import { createProject } from '@create-stapler-app/core';
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

function displayHeader() {
  const metalGradient = gradient([
    { color: '#4F4F4F', pos: 0 },
    { color: '#B0B0B0', pos: 0.5 },
    { color: '#4F4F4F', pos: 1 },
  ]);

  console.log(metalGradient(asciiArt));
  console.log(chalk.bold('\n🖇️ Welcome to Stapler!\n'));
}

const program = new Command();

program
  .name('create-stapler-app')
  .description('CLI to bootstrap a new tonik-infused app')
  .version('0.1.0')
  .hook('preAction', () => {
    displayHeader();
  });

const createAction = async () => {
  const currentDir = process.cwd();
  const unfinishedProjects: UnfinishedProject[] = findUnfinishedProjects(currentDir);
  let proceedWithNewProject = true;
  let selectedProject: UnfinishedProject | null = null;

  if (unfinishedProjects.length > 0) {
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
    // Resume the selected project
    process.chdir(selectedProject.projectPath);
    await createProject(selectedProject.state.options, selectedProject.projectPath);
  } else {
    // create new project
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project named?',
        default: 'my-stapled-app',
      },
      {
        type: 'confirm',
        name: 'usePayload',
        message: 'Would you like to add Payload to your app?',
        default: true,
      },
    ]);

    await createProject(answers, process.cwd());
  }
};

program.command('create').description('Create a new tonik-infused app').action(createAction);

// Set "create" as the default command
program.action(createAction);

program.parse();
