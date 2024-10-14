#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import gradient from 'gradient-string';

import { createProject } from '@create-stapler-app/core';

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
    // we dont support Inngest yet
    // {
    //   type: "confirm",
    //   name: "useInngest",
    //   message: "Would you like to add Inngest to your app?",
    //   default: false,
    // },
  ]);

  await createProject(answers);
};

program.command('create').description('Create a new tonik-infused app').action(createAction);

// Set "create" as the default command
program.action(createAction);

program.parse();
