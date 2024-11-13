import { execSync } from 'child_process';
import { logger } from '../../../utils/logger';

export const prettify = async () => {
  await logger.withSpinner('prettier', 'Prettifying...', async (spinner) => {
    try {
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

      // Add ignore patterns to .prettierignore
      ignorePatterns.forEach((pattern) => {
        execSync(`echo ${pattern} >> .prettierignore`);
      });

      // Run prettier on the project files
      execSync(`npx prettier --write "apps/web/**/*.{ts,tsx}" --log-level silent`, {
        stdio: 'inherit',
      });

      spinner.succeed('Prettified.');
    } catch (error) {
      spinner.fail('Prettifying failed');
      console.error('Error during prettifying:', error);
    }
  });
};
