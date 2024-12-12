import chalk from 'chalk';
import ora, { Ora } from 'ora';

const LABEL_WIDTH = 7;
const LABEL_BG_COLOR = '#FAD400';
const LABEL_TEXT_COLOR = '#000000';
const DIMMED_LABEL_BG_COLOR = '#5C4D00';
const CHECK_MARK_COLOR = '#FAD400';
const ACTIVE_TEXT_COLOR = '#FFFFFF';
const COMPLETED_TEXT_COLOR = '#666666';
const SPACING = 2;

type Name =
  | 'dir'
  | 'cms'
  | 'git'
  | 'db'
  | 'vrcl'
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
  align?: 'left' | 'right';
}

const labels: Record<Name, LabelConfig> = {
  dir: { text: 'dir' },
  cms: { text: 'cms' },
  git: { text: 'git' },
  db: { text: 'db' },
  vrcl: { text: 'vrcl' },
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

const completedSteps = new Set<Name>();
const stepOutputs = new Map<Name, string[]>();

const formatLabel = (name: Name): string => {
  const config = labels[name];
  const label = config.text.padStart(LABEL_WIDTH);
  const bgColor = LABEL_BG_COLOR;

  return chalk.bgHex(bgColor).hex(LABEL_TEXT_COLOR)(` ${label} `);
};

const formatCheckMark = (): string => {
  return chalk.hex(CHECK_MARK_COLOR)('✓');
};

const formatMessage = (message: string, isCompleted: boolean = false): string => {
  return isCompleted ? chalk.hex(COMPLETED_TEXT_COLOR)(message) : chalk.hex(ACTIVE_TEXT_COLOR)(message);
};

const reprintPreviousOutput = () => {
  stepOutputs.forEach((outputs, step) => {
    outputs.forEach((output) => {
      const label = formatLabel(step);
      const checkmark = formatCheckMark() + ' ';
      const padding = ' '.repeat(SPACING);
      const formattedOutput = formatMessage(output);

      const labelConfig = labels[step];
      labelConfig.align = labelConfig.align || 'right';
      console.log(labelConfig.align);
      if (labelConfig.align === 'right') {
        const leftPadding = ' '.repeat(LABEL_WIDTH + SPACING);
        console.log(`${leftPadding}${label}${padding}${checkmark}${formattedOutput}`);
      } else {
        console.log(`${label}${padding}${checkmark}${formattedOutput}`);
      }
    });
  });
};

const log = (name: Name, messages: string[] | string, showCheck: boolean = true): void => {
  // Update current step
  console.clear();
  reprintPreviousOutput();

  const messageText = typeof messages === 'string' ? messages : messages.join(' ');

  // Store output for reprinting
  if (!stepOutputs.has(name)) {
    stepOutputs.set(name, []);
  }
  stepOutputs.get(name)?.push(messageText);

  // Print current message
  const label = formatLabel(name);
  const checkmark = showCheck ? formatCheckMark() + ' ' : '  ';
  const padding = ' '.repeat(SPACING);

  const labelConfig = labels[name];
  if (labelConfig.align === 'right') {
    const leftPadding = ' '.repeat(LABEL_WIDTH + SPACING);
    console.log(`${leftPadding}${label}${padding}${checkmark}${formatMessage(messageText)}`);
  } else {
    console.log(`${label}${padding}${checkmark}${formatMessage(messageText)}`);
  }
};

const createSpinner = (initialText?: string): Ora => {
  const padding = ' '.repeat(SPACING);

  return ora({
    prefixText: `${padding}`,
    text: initialText,
    spinner: 'dots',
    color: 'yellow',
  });
};

const withSpinner = async <T>(
  initialText: string,
  action: (spinner: Ora) => Promise<T>,
  label?: string,
): Promise<T> => {
  const spinner = createSpinner(initialText);
  try {
    spinner.start();
    const result = await action(spinner);

    // Store and display completion message
    if (!stepOutputs.has(name)) {
      stepOutputs.set(name, []);
    }
    stepOutputs.get(name)?.push(initialText);

    spinner.stop();
    log(name, initialText, true);

    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
};

const logUserInput = (step: Name, input: string) => {
  if (!stepOutputs.has(step)) {
    stepOutputs.set(step, []);
  }
  stepOutputs.get(step)?.push(input);
};

// Reset all state (useful for testing or restarting the process)
const reset = () => {
  completedSteps.clear();
  stepOutputs.clear();
};

const displayHeader = () => {
  const block = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_BG_COLOR)('█');
  const stplrText = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_TEXT_COLOR)('stplr');
  const stplrLeft = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_TEXT_COLOR)(String.fromCharCode(9484));
  const stplrMiddle = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_TEXT_COLOR)(String.fromCharCode(9472));
  const stplrRight = chalk.bgHex(LABEL_BG_COLOR).hex(LABEL_TEXT_COLOR)(String.fromCharCode(9488));
  const triangle = chalk.hex(LABEL_BG_COLOR)(String.fromCharCode(9701));

  const logoLines = [
    `${block}${block}${block}${stplrLeft}${stplrMiddle}${stplrRight}${block}`,
    `${block}${stplrText}${block}`,
    `      ${triangle}`,
    `       `,
  ];

  const title = 'Stapler setup initialized';
  const subText1 = ' ';
  const subText2 = 'Everything is fine.';
  const subText3 = "I've done this like a million times.";

  const padding = 4;

  const output = [
    '', // Initial newline
    `  ${logoLines[0]}${' '.repeat(padding)}${chalk.hex(ACTIVE_TEXT_COLOR)(title)}`,
    `  ${logoLines[1]}${' '.repeat(padding)}${chalk.gray(subText1)}`,
    `  ${logoLines[2]}${' '.repeat(padding)}${chalk.gray(subText2)}`,
    `  ${logoLines[3]}${' '.repeat(padding)}${chalk.gray(subText3)}`,
    '',
  ].join('\n');

  console.log(output);
};

export const logger = {
  log,
  createSpinner,
  withSpinner,
  displayHeader,
  reset,
  logUserInput,
};
