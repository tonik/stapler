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
  console.log(chalk.bold("\n🍸 Welcome to Stapler!\n"));
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
        name: "name",
        message: "What is your project named?",
        default: "my-stapled-app",
      },
      {
        type: "confirm",
        name: "usePayload",
        message: "Would you like to add Payload to your app?",
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
  });

program.parse();
