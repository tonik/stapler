import path from 'path';
import { fileURLToPath } from 'node:url';
import { docFiles } from '../../templates/docs/installConfig';
import { templateGenerator } from '../generator/generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createDocFiles = () => {
  console.log('🖇️  Writing docs...');
  const templateDirectory = path.join(__dirname, '../../core/templates/docs/files');
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
