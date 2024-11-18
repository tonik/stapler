import { docFiles } from '../../../templates/docs/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { logger } from '../../../utils/logger';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';

export const createDocFiles = async () => {
  await logger.withSpinner('stapler', 'Writing docs...', async (spinner) => {
    try {
      const templateDirectory = getTemplateDirectory(`/templates/docs/files`);
      const destinationDirectory = process.cwd();

      templateGenerator(docFiles, templateDirectory, destinationDirectory);

      spinner.succeed('Docs written successfully.');
    } catch (error) {
      spinner.fail('Failed to write docs');
      console.error('Error writing docs:', error);
    }
  });
};
