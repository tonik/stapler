import chalk from 'chalk';
import gradient from 'gradient-string';

type Name = 'stapler' | 'turborepo' | 'supabase' | 'payload' | 'github' | 'prettier' | 'vercel' | 'docker' | 'error';

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
    name: 'error',
    prefix: 'Error',
    colors: ['#990000', '#FF0000'],
  },
];

export const logWithColoredPrefix = (name: Name, messages: string[] | string) => {
  const color = names.find((color) => color.name === name);
  if (!color) {
    console.log(chalk.red('Invalid color name.'));
    return;
  }
  const gradientColor = gradient(color.colors);

  if (name === 'vercel') {
    return console.log(
      chalk.bgBlack(gradientColor(`[▲ ${color.prefix}]`)),
      typeof messages === 'string' ? messages : messages.join(' '),
    );
  }

  return console.log(gradientColor(`[${color.prefix}]`), typeof messages === 'string' ? messages : messages.join(' '));
};
