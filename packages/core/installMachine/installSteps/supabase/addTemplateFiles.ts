import fs from 'fs';
import path from 'path';
import { supabaseFiles } from '../../../templates/supabase/installConfig';
import { templateGenerator } from '../../../utils/generator/generator';
import { getTemplateDirectory } from '../../../utils/getTemplateDirectory';
import { logger } from '../../../utils/logger';

export const addTemplateFiles = async (destinationDirectory: string) => {
  await logger.withSpinner('supabase', 'Adding files from template...', async (spinner) => {
    const templateDirectory = getTemplateDirectory(`/templates/supabase/files/`);
    templateGenerator(supabaseFiles, templateDirectory, destinationDirectory);

    // Add "supabase/**" to pnpm-workspace.yaml
    const workspacePath = path.join(destinationDirectory, 'pnpm-workspace.yaml');
    const addSupabaseToWorkspace = `  - "supabase/**"`;
    const fileContents = fs.readFileSync(workspacePath, 'utf-8');
    if (!fileContents.includes(addSupabaseToWorkspace)) {
      fs.appendFileSync(workspacePath, `${addSupabaseToWorkspace}\n`);
    }

    spinner.succeed('Files added.');
  });
};
