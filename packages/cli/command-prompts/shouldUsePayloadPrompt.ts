import inquirer from 'inquirer';

/**
 * Prompts the user to confirm whether they want to overwrite an existing project directory.
 *
 * @param projectName - The name of the project that already exists.
 * @returns A promise that returns object with usePayload boolean value.
 *
 **/

export const shouldUsePayloadPrompt = async (): Promise<{ usePayload: boolean }> =>
  await inquirer.prompt([
    {
      type: 'confirm',
      name: 'usePayload',
      message: 'Would you like to add Payload to your app?',
      default: true,
    },
  ]);
