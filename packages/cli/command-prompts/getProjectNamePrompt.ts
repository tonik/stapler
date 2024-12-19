import Enquirer from 'enquirer';
import { LEFT_PADDING } from 'stplr-utils';

export const getProjectNamePrompt = async (): Promise<string> => {
  const enquirer = new Enquirer();
  const response = (await enquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'What is your project named?',
    initial: 'my-stapled-app',
    prefix: LEFT_PADDING,
  })) as { name: string };

  return response.name;
};
