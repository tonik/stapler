#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { createProject } from "@create-tonik-app/core";

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
  console.log(chalk.hex("#3100F5").bold(asciiArt));
  console.log(chalk.bold("\nWelcome to Create Tonik App!\n"));
}

const program = new Command();

program
  .name("create-tonik-app")
  .description("CLI to bootstrap a new tonik-infused app")
  .version("0.1.0")
  .hook("preAction", () => {
    displayHeader();
  });

program
  .command("create")
  .description("Create a new tonik-infused app")
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "What is your project named?",
        default: "my-tonik-app",
      },
      {
        type: "confirm",
        name: "useInngest",
        message: "Would you like to add Inngest to your app?",
        default: false,
      },
      // Add more questions for T3 options and your custom additions
    ]);

    await createProject(answers);
  });

program.parse();
