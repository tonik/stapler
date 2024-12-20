import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { displayHeader } from './displayHeader';

export const SPACING = 2;
export const LABEL_WIDTH = 9;
export const LABEL_BG_COLOR = '#FAD400';
export const LABEL_TEXT_COLOR = '#000000';
export const DIMMED_COLOR = '#5C4D00';
export const CHECK_MARK_COLOR = '#FAD400';
export const ACTIVE_TEXT_COLOR = '#FFFFFF';
export const COMPLETED_TEXT_COLOR = '#666666';

export const LEFT_PADDING = ' '.repeat(SPACING + LABEL_WIDTH - 1);

type Name =
  | 'dir'
  | 'cms'
  | 'git'
  | 'db'
  | 'auth'
  | 'stapler'
  | 'turborepo'
  | 'supabase'
  | 'tailwind'
  | 'payload'
  | 'github'
  | 'prettier'
  | 'deployment'
  | 'vercel'
  | 'docker'
  | 'postgres'
  | 'error';

interface LabelConfig {
  text: string;
}

const labels: Record<Name, LabelConfig> = {
  dir: { text: 'dir' },
  cms: { text: 'cms' },
  git: { text: 'git' },
  db: { text: 'db' },
  auth: { text: 'auth' },
  stapler: { text: 'stplr' },
  turborepo: { text: 'turbo' },
  supabase: { text: 'supa' },
  tailwind: { text: 'tw' },
  payload: { text: 'cms' },
  github: { text: 'git' },
  prettier: { text: 'fmt' },
  deployment: { text: 'dep' },
  vercel: { text: 'vrcl' },
  docker: { text: 'dock' },
  postgres: { text: 'pg' },
  error: { text: 'error' },
};

const gap = ' '.repeat(SPACING);
const leftPadding = ' '.repeat(LABEL_WIDTH);

const formatLabel = (name: Name): string => {
  const labelText = ` ${labels[name].text} `;
  const label = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_TEXT_COLOR)(labelText);
  const padding = ' '.repeat(LABEL_WIDTH - labelText.length);

  return `${padding}${label}`;
};

const formatCheckMark = (): string => {
  return chalk.hex(CHECK_MARK_COLOR)('✓');
};

const formatMessage = (message: string, isCompleted: boolean = false): string => {
  return isCompleted ? chalk.hex(COMPLETED_TEXT_COLOR)(message) : chalk.hex(ACTIVE_TEXT_COLOR)(message);
};

const log = (messages: string[] | string, showCheck: boolean = true): void => {
  // Print current message
  const checkmark = showCheck ? formatCheckMark() + ' ' : '  ';

  messages = Array.isArray(messages) ? messages : [messages];
  messages.forEach((message) => {
    console.log(`${leftPadding}${gap}${checkmark}${formatMessage(message)}`);
  });
};

const withLabel = (label: Name, message: string): void => {
  const formattedLabel = formatLabel(label);
  console.log(` `);
  console.log(`${formattedLabel}${gap}${formatMessage(message)}`);
  console.log(` `);
};

const createSpinner = (initialText?: string): Ora => {
  const padding = ' '.repeat(SPACING);

  const spinner = {
    frames: [
      `${chalk.hex(LABEL_BG_COLOR)('[')}  ${chalk.hex(DIMMED_COLOR)(']')}`,
      ` ${chalk.hex(LABEL_BG_COLOR)('[')}${chalk.hex(DIMMED_COLOR)(']')} `,
      ` ${chalk.hex(DIMMED_COLOR)(']')}${chalk.hex(LABEL_BG_COLOR)('[')} `,
      `${chalk.hex(DIMMED_COLOR)(']')}  ${chalk.hex(LABEL_BG_COLOR)('[')}`,
      ` ${chalk.hex(DIMMED_COLOR)(']')}${chalk.hex(LABEL_BG_COLOR)('[')} `,
      ` ${chalk.hex(LABEL_BG_COLOR)('[')}${chalk.hex(DIMMED_COLOR)(']')} `,
    ],
    interval: 140,
  };
  return ora({
    suffixText: `${padding}`,
    text: initialText,
    spinner: spinner,
    color: 'yellow',
    indent: LABEL_WIDTH + SPACING,
  });
};

const withSpinner = async <T>(initialText: string, action: (spinner: Ora) => Promise<T>): Promise<T> => {
  const spinner = createSpinner(initialText);
  try {
    spinner.start();
    const result = await action(spinner);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
};

export const logger = {
  createSpinner,
  log,
  withSpinner,
  withLabel,
  displayHeader: () => displayHeader(LABEL_BG_COLOR, LABEL_TEXT_COLOR, ACTIVE_TEXT_COLOR),
};
