import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { tailwindFiles } from '../../../templates/tailwind/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from '../../../utils/logger';

export const installTailwind = async (destinationDirectory: string) => {
  await logger.withSpinner('tailwind', 'Adding Tailwind...', async (spinner) => {
    try {
      installTailwindPackage(destinationDirectory);
      copyTailwindFiles(destinationDirectory);
      spinner.succeed('Tailwind installed.');
    } catch (error) {
      spinner.fail('Tailwind installation failed');
      console.error('Error during tailwind installation:', error);
    }
  });
};

const copyTailwindFiles = (destinationDirectory: string) => {
  const templateDirectory = getTemplateDirectory(`/templates/tailwind/files/`);
  templateGenerator(tailwindFiles, templateDirectory, destinationDirectory);
};

const installTailwindPackage = async (destinationDirectory: string) => {
  const packageJsonPath = path.join(destinationDirectory, 'apps/web/package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  delete packageJson.dependencies['@repo/ui'];
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  process.chdir(path.join(destinationDirectory, 'apps/web'));
  execSync('pnpm add -D tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  process.chdir(destinationDirectory);
  execSync('pnpm install', { stdio: 'inherit' });
};
