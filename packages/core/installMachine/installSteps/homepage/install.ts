import { homepageFiles } from '../../../templates/homepage/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from 'stplr-utils';

export const modifyHomepage = async (destinationDirectory: string) => {
  await logger.withSpinner('Setting up your welcome homepage...', async (spinner) => {
    try {
      const templateDirectory = getTemplateDirectory(`/templates/homepage/files/`);
      templateGenerator(homepageFiles, templateDirectory, destinationDirectory);
      spinner.succeed('Homepage setup completed.');
    } catch (error) {
      spinner.fail('Tailwind installation failed');
      console.error('Error during tailwind installation:', error);
    }
  });
};
