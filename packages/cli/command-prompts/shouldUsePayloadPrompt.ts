import Enquirer from 'enquirer';
import { LEFT_PADDING } from 'stplr-utils';

/**
 * Prompts the user to confirm whether they want to overwrite an existing project directory.
 *
 * @param projectName - The name of the project that already exists.
 * @returns A promise that returns object with usePayload boolean value.
 *
 **/

export const shouldUsePayloadPrompt = async (): Promise<{ usePayload: boolean }> => {
  const enquirer = new Enquirer();
  const response = (await enquirer.prompt({
    type: 'confirm',
    name: 'usePayload',
    message: 'Would you like to use Payload?',
    initial: true, // Default value
    prefix: LEFT_PADDING, // Removes the default '?' prefix
  })) as { usePayload: boolean };

  return response;
};
