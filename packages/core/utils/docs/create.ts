import path from 'path';
import { docFiles } from '../../templates/docs/installConfig';
import { templateGenerator } from '../generator/generator';

export const createDocFiles = () => {
  console.log('🖇️  Writing docs...');
  const templateDirectory = path.join(__dirname, '../templates/docs/files');
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
