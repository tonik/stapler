import chalk from 'chalk';
import { CHECK_MARK_COLOR, LABEL_WIDTH, SPACING } from 'stplr-utils';
import { delay } from '../../../utils/delay';

const getMessages = (name: string, prettyDeploymentUrl: string, shouldDeploy: boolean) => {
  const messages = [
    '🍸 Filling a high ball glass with ice...',
    '🍸 Adding gin and lime juice...',
    `🍸 Topping with ${chalk.blue('Tonik')}...`,
    '🍸 Garnishing with lime wedge...',
    `🍸 ${chalk.hex(CHECK_MARK_COLOR)(`Your Stapled ${chalk.hex(CHECK_MARK_COLOR)(name)} is ready!`)}`,
    `🍸 Ready to explore? Jump into your project with: ${chalk.hex(CHECK_MARK_COLOR)(`cd ${name} && pnpm dev`)}`,
  ];

  if (shouldDeploy) {
    messages.push(`🍸 Prefer to see it online? Check it out here: ${chalk.hex(CHECK_MARK_COLOR)(prettyDeploymentUrl)}`);
  } else {
    messages.push('🍸 Want to deploy your project? Run `stplr` within your project directory.');
  }

  return messages;
};

export const prepareDrink = async (name: string, prettyDeploymentUrl: string, shouldDeploy: boolean) => {
  const leftPadding = ' '.repeat(SPACING + LABEL_WIDTH);
  const messages = getMessages(name, prettyDeploymentUrl, shouldDeploy);

  for (const message of messages) {
    console.log(`${leftPadding}${message}`);
    await delay(1000);
  }
};
