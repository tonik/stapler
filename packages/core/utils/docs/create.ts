import { docFiles } from '../../templates/docs/installConfig';
import { templateGenerator } from '../generator/generator';
import { getTemplateDirectory } from '../shared/getTemplateDirectory';

export const createDocFiles = () => {
  console.log('Writing docs...');
  const templateDirectory = getTemplateDirectory(`/templates/docs/files`);
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
