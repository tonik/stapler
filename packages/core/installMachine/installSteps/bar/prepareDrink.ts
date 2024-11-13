import chalk from 'chalk';
import { delay } from '../../../utils/delay';

const getMessages = (name: string) => {
  return [
    '🍸 Filling a high ball glass with ice...',
    '🍸 Adding gin and lime juice...',
    `🍸 Topping with ${chalk.blue('Tonik')}...`,
    '🍸 Garnishing with lime wedge...',
    `🍸 ${chalk.green(`Your Stapled ${name} is ready!`)}`,
    `🍸 You can now run: ${chalk.cyan(`cd ${name} && pnpm dev`)}`,
  ];
};

export const prepareDrink = async (name: string) => {
  const messages = getMessages(name);

  for (const message of messages) {
    console.log(message);
    await delay(1000);
  }
};
