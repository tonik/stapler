import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getTemplateDirectory = (directory: string) => {
  // Function to determine the environment
  const getEnvironment = () => {
    if (__dirname.includes('/.npm/')) {
      return 'npx';
    } else if (__dirname.includes('/.pnpm/')) {
      return 'pnpm';
    }
    return 'local';
  };

  let templateDirectory;
  switch (getEnvironment()) {
    case 'local':
      templateDirectory = path.join(__dirname, '../../core/', directory);
      break;
    default:
      templateDirectory = path.join(__dirname, '../', directory);
  }

  return templateDirectory;
};
