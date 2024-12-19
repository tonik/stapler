import inquirer from 'inquirer';

export const getProjectNamePrompt = async (): Promise<string> => {
  return (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project named?',
        default: 'my-stapled-app',
      },
    ])
  ).name;
};
