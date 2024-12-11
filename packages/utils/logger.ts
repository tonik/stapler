import chalk from 'chalk';
import ora, { Ora } from 'ora';

const LABEL_WIDTH = 8;
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
  turborepo: { text: 'turbo', align: 'right' },
  supabase: { text: 'supa', align: 'right' },
  tailwind: { text: 'tw', align: 'right' },
  payload: { text: 'cms', align: 'right' },
  github: { text: 'git', align: 'right' },
  prettier: { text: 'fmt', align: 'right' },
  vercel: { text: 'vrcl', align: 'right' },
  docker: { text: 'dock', align: 'right' },
  postgres: { text: 'pg', align: 'right' },
  error: { text: 'error', align: 'right' },
};

let currentStep: Name | null = null;
const completedSteps = new Set<Name>();
const stepOutputs = new Map<Name, string[]>();

const formatLabel = (name: Name): string => {
  const config = labels[name];
  const label = config.text.padEnd(LABEL_WIDTH);
  const isDimmed = currentStep !== null && name !== currentStep && !completedSteps.has(name);
  const bgColor = isDimmed ? DIMMED_LABEL_BG_COLOR : LABEL_BG_COLOR;

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
      const isCompleted = step !== currentStep;
      const formattedOutput = formatMessage(output, isCompleted);

      const labelConfig = labels[step];
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
  if (currentStep !== name) {
    if (currentStep) {
      completedSteps.add(currentStep);
    }
    currentStep = name;

    // Clear console and reprint previous outputs
    console.clear();
    displayHeader();
    reprintPreviousOutput();
  }

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
  const isCompleted = name !== currentStep;

  const labelConfig = labels[name];
  if (labelConfig.align === 'right') {
    const leftPadding = ' '.repeat(LABEL_WIDTH + SPACING);
    console.log(`${leftPadding}${label}${padding}${checkmark}${formatMessage(messageText, isCompleted)}`);
  } else {
    console.log(`${label}${padding}${checkmark}${formatMessage(messageText, isCompleted)}`);
  }
};

const createSpinner = (name: Name, initialText?: string): Ora => {
  const label = formatLabel(name);
  const padding = ' '.repeat(SPACING);

  return ora({
    prefixText: `${label}${padding}`,
    text: initialText,
    spinner: 'dots',
    color: 'yellow',
  });
};

const withSpinner = async <T>(name: Name, initialText: string, action: (spinner: Ora) => Promise<T>): Promise<T> => {
  if (currentStep !== name) {
    if (currentStep) {
      completedSteps.add(currentStep);
    }
    currentStep = name;
  }

  const spinner = createSpinner(name, initialText);
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
  currentStep = null;
  completedSteps.clear();
  stepOutputs.clear();
};

const displayHeader = () => {
  const block = chalk.hex(LABEL_BG_COLOR)('█');
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

  const logoWidth = logoLines[0].length;
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
