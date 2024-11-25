import chalk from 'chalk';
import { delay } from '../../../utils/delay';

const getMessages = (name: string, prettyDeploymentUrl: string) => {
  return [
    '🍸 Filling a high ball glass with ice...',
    '🍸 Adding gin and lime juice...',
    `🍸 Topping with ${chalk.blue('Tonik')}...`,
    '🍸 Garnishing with lime wedge...',
    `🍸 ${chalk.green(`Your Stapled ${name} is ready!`)}`,
    `🍸 Ready to explore? Jump into your project with: ${chalk.cyan(`cd ${name} && pnpm dev`)}`,
    `🍸 Prefer to see it online? Check it out here: ${chalk.cyan(prettyDeploymentUrl)}`,
  ];
};

export const prepareDrink = async (name: string, prettyDeploymentUrl: string) => {
  const messages = getMessages(name, prettyDeploymentUrl);

  for (const message of messages) {
    console.log(message);
    await delay(1000);
  }
};
