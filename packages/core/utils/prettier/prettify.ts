import { execSync } from 'child_process';
import { getLogColor } from '../shared/getLogColor';

export const prettify = async () => {
  getLogColor('prettier', 'Prettifying...');

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
