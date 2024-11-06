import { docFiles } from '../../../templates/docs/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';

export const createDocFiles = () => {
  logWithColoredPrefix('stapler', 'Writing docs...');
  const templateDirectory = getTemplateDirectory(`/templates/docs/files`);
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
