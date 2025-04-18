import chalk from 'chalk';
import Enquirer from 'enquirer';
import { CHECK_MARK_COLOR, LEFT_PADDING } from 'stplr-utils';

/**
 * Prompts the user to confirm whether they want to overwrite an existing project directory.
 *
 * @param projectName - The name of the project that already exists.
 * @returns A promise that returns object with usePayload boolean value.
 *
 **/

export const shouldUsePayloadPrompt = async (): Promise<{ usePayload: boolean }> => {
  const payloadEnquirer = new Enquirer();
  const response = (await payloadEnquirer.prompt({
    type: 'confirm',
    name: 'usePayload',
    message: chalk.whiteBright('Would you like to use Payload?'),
    initial: true, // Default value
    prefix: LEFT_PADDING, // Removes the default '?' prefix
    format(value) {
      return `${chalk.hex(CHECK_MARK_COLOR)(value)}`;
    },
  })) as { usePayload: boolean };

  return response;
};
