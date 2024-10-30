#!/usr/bin/env node
import fs from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import { findUnfinishedProjects, UnfinishedProject } from './utils/findUnfinishedProjects';
import { createProject } from '@tonik/create-stapler-app-core';

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
    { color: '#FFFFFF', pos: 0.5 },
    { color: '#BDBDBD', pos: 0.75 },
    { color: '#3C3C3C', pos: 1 },
  ]);

  console.log(metalGradient(asciiArt));
  console.log(chalk.bold('\n🖇️  Welcome to Stapler!\n'));
};

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
    process.chdir(selectedProject.projectPath);
    selectedProject.state.options.name = selectedProject.projectName;
    await createProject(selectedProject.state.options, selectedProject.projectPath)
      .then(() => {
        console.log('Project resumed successfully!');
      })
      .catch((error) => {
        console.error('Error resuming project:', error);
      });
  } else {
    // create new project
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project named?',
        default: 'my-stapled-app',
      },
    ]);
    const projectDir = `${currentDir}/${answers.name}`;
    // Check if the directory already exists
    if (fs.existsSync(projectDir)) {
      const overwriteAnswer = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `The directory "${answers.name}" already exists. Do you want to overwrite it?`,
          default: false,
        },
      ]);

      if (!overwriteAnswer.overwrite) {
        console.log(chalk.red('Project creation canceled. Project directory already exists.'));
        return;
      }

      // Optional: Clear the directory if overwrite is confirmed
      fs.rmSync(projectDir, { recursive: true, force: true });
      console.log(chalk.yellow(`The directory "${answers.name}" has been cleared.`));
    }

    // Now proceed with further questions like adding Payload
    const payloadAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'usePayload',
        message: 'Would you like to add Payload to your app?',
        default: true,
      },
    ]);

    const finalOptions = { ...answers, ...payloadAnswer };

    await createProject(finalOptions, projectDir)
      .then(() => {
        console.log(chalk.green('Project created successfully!'));
        console.log(chalk.green(`with options: ${JSON.stringify(finalOptions)}`));
      })
      .catch((error) => {
        console.error(chalk.red('Error creating project:', error));
      });
  }
};

program.command('create').description('Create a new tonik-infused app').action(createAction);

// Set "create" as the default command
program.action(createAction);

program.parse();
