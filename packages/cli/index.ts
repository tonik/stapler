import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject } from '@create-awesome-app/core';

const asciiArt = `
.#####(. .######. .#####(. .###### .#####(. .,***,, .,,.. .######. .############(, .*(#############(/. ./####(.*(############(/. /#####( .###### *######(, .############(, ,#####################* ./#######################/. /#####( .######. *######(. .#####(, .#######/. ./(######, ./#######(*. ,(######(. /#####( .###### *######/ .#####(. ,(#####* .######* ./#####/. .######* /#####( .######. /######* .#####(. /####(* .(##### ./#####/ (#####* /#####( .######(######(. .#####(. .(####(, ./#####. ./#####/ (#####* /#####( .###############( .#####(. /#####/ ,#####( ./#####/ (#####* /#####( .########/.,(#####* .#####(. (#####(, ./######. ./#####/ (#####* /#####( .######/ *#####(, .#####(. *########*. .*(#######/ ./#####/ (#####* /#####( .###### (#####/. .#####(. ,###################/ ./#####/ (#####* /#####( .######. .######* .#(((((. .*(##########/,. ./#(((#/ (((((#* /#((((/ .#((((# *#((((#,
`;

function displayHeader() {
    console.log(chalk.cyan(asciiArt));
    console.log(chalk.bold('\nWelcome to Create Awesome App!\n'));
  }
  
const program = new Command();

program
  .name('create-awesome-app')
  .description('CLI to bootstrap a new awesome app')
  .version('0.1.0')
  .hook('preAction', () => {
    displayHeader();
  });

program.command('create')
  .description('Create a new awesome app')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project named?',
        default: 'my-awesome-app',
      },
      {
        type: 'confirm',
        name: 'useInngest',
        message: 'Would you like to add Inngest to your app?',
        default: false,
      },
      // Add more questions for T3 options and your custom additions
    ]);

    await createProject(answers);
  });

program.parse();