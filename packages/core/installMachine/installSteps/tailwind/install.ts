import fs from 'fs';
import path from 'path';
import { tailwindFiles } from '../../../templates/tailwind/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from '../../../utils/logger';
import { execAsync } from '../../../utils/execAsync';

const copyTailwindFiles = (currentDir: string) => {
  const templateDirectory = getTemplateDirectory(`/templates/tailwind/files/`);
  templateGenerator(tailwindFiles, templateDirectory, currentDir);
};

const installTailwindPackage = async (currentDir: string) => {
  const packageJsonPath = path.join(currentDir, 'apps/web/package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  delete packageJson.dependencies['@repo/ui'];
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  process.chdir(path.join(currentDir, 'apps/web'));
  await execAsync('pnpm add -D tailwindcss postcss autoprefixer');
  process.chdir(currentDir);
  await execAsync('pnpm install --reporter silent');
};

export const installTailwind = async (currentDir: string) => {
  await logger.withSpinner('tailwind', 'Adding Tailwind...', async (spinner) => {
    try {
      await installTailwindPackage(currentDir);
      copyTailwindFiles(currentDir);
      spinner.succeed('Tailwind installed.');
    } catch (error) {
      spinner.fail('Tailwind installation failed');
      console.error('Error during tailwind installation:', error);
    }
  });
};
