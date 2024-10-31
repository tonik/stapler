import { execSync } from 'child_process';
import gradient from 'gradient-string';

const prettifyGradient = gradient([
  { color: '#F11D28', pos: 0 },
  { color: '#FFA12C', pos: 1 },
]);
export const prettify = async () => {
  console.log(prettifyGradient('Prettifying...'));

  const ignorePatterns = [
    'node_modules/',
    'dist/',
    'build/',
    '.turbo/',
    '.next/',
    `\\(app\\)/`,
    'payload-types.ts',
    `\\(payload\\)/`,
    '*.d.ts',
  ];

  ignorePatterns.forEach((pattern) => {
    execSync(`echo ${pattern} >> .prettierignore`);
  });

  execSync(`npx prettier --write "apps/web/**/*.{ts,tsx}"`, {
    stdio: 'inherit',
  });
};
