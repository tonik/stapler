import { docFiles } from '../../../templates/docs/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { logger } from '../../../utils/logger';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';

export const createDocFiles = () => {
  logger.log('stapler', 'Writing docs...');
  const templateDirectory = getTemplateDirectory(`/templates/docs/files`);
  const destinationDirectory = process.cwd();

  templateGenerator(docFiles, templateDirectory, destinationDirectory);
};
