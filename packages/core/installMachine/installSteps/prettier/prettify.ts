import { execSync } from 'child_process';
import { logger } from '../../../utils/logger';

export const prettify = async () => {
  logger.log('prettier', 'Prettifying...');

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

  execSync(`npx prettier --write "apps/web/**/*.{ts,tsx}" --log-level silent`, {
    stdio: 'inherit',
  });
};
