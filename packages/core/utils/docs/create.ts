import { docFiles } from '../../templates/docs/installConfig';
import { templateGenerator } from '../generator/generator';
import { logWithColoredPrefix } from '../shared/logWithColoredPrefix';
import { getTemplateDirectory } from '../shared/getTemplateDirectory';

export const createDocFiles = () => {
  logWithColoredPrefix('stapler', 'Writing docs...');
  const templateDirectory = getTemplateDirectory(`/templates/docs/files`);
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
