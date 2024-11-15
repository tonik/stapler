import { homepageFiles } from '../../../templates/homepage/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logWithColoredPrefix } from '../../../utils/logWithColoredPrefix';

export const modifyHomepage = async (destinationDirectory: string) => {
  logWithColoredPrefix('tailwind', 'Adding homepage files...');
  const templateDirectory = getTemplateDirectory(`/templates/homepage/files/`);
  templateGenerator(homepageFiles, templateDirectory, destinationDirectory);
  logWithColoredPrefix('tailwind', 'Homepage files added');
};
