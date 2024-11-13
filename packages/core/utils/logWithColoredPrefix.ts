import chalk from 'chalk';
import gradient from 'gradient-string';
import ora, { Ora } from 'ora';

type Name =
  | 'stapler'
  | 'turborepo'
  | 'supabase'
  | 'payload'
  | 'github'
  | 'prettier'
  | 'vercel'
  | 'docker'
  | 'postgres'
  | 'error';

type NameProps = {
  name: Name;
  prefix: string;
  colors: string[];
};

const names: NameProps[] = [
  {
    name: 'stapler',
    prefix: 'Stapler',
    colors: ['#FAFAFA', '#FAFAFA'],
  },
  {
    name: 'turborepo',
    prefix: 'Turbo',
    colors: ['#0099F7', '#F11712'],
  },
  {
    name: 'supabase',
    prefix: 'Supabase',
    colors: ['#3ABC82', '#259764'],
  },
  {
    name: 'payload',
    prefix: 'Payload',
    colors: ['#12324A', '#E5AA5F'],
  },
  {
    name: 'github',
    prefix: 'GitHub',
    colors: ['#3B8640', '#8256D0'],
  },
  {
    name: 'prettier',
    prefix: 'Prettier',
    colors: ['#F11D28', '#FFA12C'],
  },
  {
    name: 'vercel',
    prefix: 'Vercel',
    colors: ['#FFF', '#FFF'],
  },
  {
    name: 'docker',
    prefix: 'Docker',
    colors: ['#0db7ed', '#0db7ed'],
  },
  {
    name: 'postgres',
    prefix: 'PostgreSQL',
    colors: ['#0064a5', '#008bb9'],
  },
  {
    name: 'error',
    prefix: 'Error',
    colors: ['#990000', '#FF0000'],
  },
];

const getPrefix = (name: Name): string => {
  const color = names.find((color) => color.name === name);
  if (!color) {
    return chalk.red('[Error]');
  }

  const gradientColor = gradient(color.colors);
  return name === 'vercel' ? chalk.bgBlack(gradientColor(`[▲ ${color.prefix}]`)) : gradientColor(`[${color.prefix}]`);
};

export const logWithColoredPrefix = (name: Name, messages: string[] | string): void => {
  const prefix = getPrefix(name);
  console.log(prefix, typeof messages === 'string' ? messages : messages.join(' '));
};

export const createSpinner = (name: Name, initialText?: string): Ora => {
  const prefix = getPrefix(name);
  return ora({
    prefixText: prefix,
    text: initialText,
    spinner: 'dots',
  });
};

export const withSpinner = async <T>(
  name: Name,
  initialText: string,
  action: (spinner: Ora) => Promise<T>,
): Promise<T> => {
  const spinner = createSpinner(name, initialText);
  try {
    spinner.start();
    const result = await action(spinner);
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
};

// Example usage with named exports
export const logger = {
  log: logWithColoredPrefix,
  createSpinner,
  withSpinner,
};
