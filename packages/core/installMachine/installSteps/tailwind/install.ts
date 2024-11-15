import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { tailwindFiles } from '../../../templates/tailwind/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const installTailwind = (destinationDirectory: string) => {
  installTailwindPackage(destinationDirectory);
  copyTailwindFiles(destinationDirectory);
};

const copyTailwindFiles = (destinationDirectory: string) => {
  logWithColoredPrefix('tailwind', `Adding Files... to ${destinationDirectory}`);

  const templateDirectory = getTemplateDirectory(`/templates/tailwind/files/`);
  templateGenerator(tailwindFiles, templateDirectory, destinationDirectory);
};

const installTailwindPackage = async (destinationDirectory: string) => {
  // we need to add to package.json into dependencies: "@tonik/tailwind-config": "latest"
  const packageJsonPath = path.join(destinationDirectory, 'apps/web/package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  delete packageJson.dependencies['@repo/ui'];
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  process.chdir(path.join(destinationDirectory, 'apps/web'));
  execSync('pnpm add -D tailwindcss postcss autoprefixer', { stdio: 'inherit' });
  logWithColoredPrefix('tailwind', 'Adding tailwind package to package.json...');
  console.log('installing deps in', destinationDirectory);
  process.chdir(destinationDirectory);
  execSync('pnpm install', { stdio: 'inherit' });
};
