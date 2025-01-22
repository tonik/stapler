import chalk from 'chalk';
import Enquirer from 'enquirer';
import { CHECK_MARK_COLOR, LEFT_PADDING } from 'stplr-utils';

export const getProjectNamePrompt = async (): Promise<string> => {
  const enquirer = new Enquirer();
  const response = (await enquirer.prompt({
    type: 'input',
    name: 'name',
    message: chalk.whiteBright('What is your project named?'),
    initial: 'my-stapled-app',
    prefix: LEFT_PADDING,
    format(value) {
      return `${chalk.hex(CHECK_MARK_COLOR)(value)}`;
    },
  })) as { name: string };

  return response.name;
};
