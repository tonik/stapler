import Enquirer from 'enquirer';
import { LEFT_PADDING } from 'stplr-utils';

/**
 * Prompts the user to confirm whether they want to overwrite an existing project directory.
 *
 * @param projectName - The name of the project that already exists.
 * @returns A promise that returns object with overwrite boolean value.
 *
 **/

export const overwriteDirectoryPrompt = async (projectName: string): Promise<{ overwrite: boolean }> => {
  const enquirer = new Enquirer();
  const response = (await enquirer.prompt({
    type: 'confirm',
    name: 'overwrite',
    message: `The directory "${projectName}" already exists. Do you want to overwrite it?`,
    initial: false,
    prefix: LEFT_PADDING,
  })) as { overwrite: boolean };

  return response;
};
