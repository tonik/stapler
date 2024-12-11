import inquirer from 'inquirer';

/**
 * Prompts the user to confirm whether they want to overwrite an existing project directory.
 *
 * @param projectName - The name of the project that already exists.
 * @returns A promise that returns object with overwrite boolean value.
 *
 **/

export const overwriteDirectoryPrompt = async (projectName: string): Promise<{ overwrite: boolean }> =>
  await inquirer.prompt([
    {
      type: 'confirm',
      name: 'overwrite',
      message: `The directory "${projectName}" already exists. Do you want to overwrite it?`,
      default: false,
    },
  ]);
