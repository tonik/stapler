import path from 'path';
import { templateGenerator } from '../generator/generator';
import { docFiles } from '../../templates/docs/installConfig';

export const createDocFiles = () => {
  console.log('🖇️ Writing docs...');
  const templateDirectory = path.join(__dirname, '../templates/docs/files');
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
