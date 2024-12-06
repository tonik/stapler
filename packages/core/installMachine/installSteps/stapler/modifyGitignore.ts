import fs from 'fs';
import path from 'path';
import { logger } from '../../../../utils/logger';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

export const modifyGitignore = async (entry: string) => {
  await logger.withSpinner('stapler', `Adding entries to .gitignore..`, async (spinner) => {
    const gitignorePath = path.join(process.cwd(), '.gitignore');

    try {
      // Read the .gitignore file
      const data = await readFileAsync(gitignorePath, 'utf8');

      // Check if the entry is already listed
      if (!data.includes(entry)) {
        // Append the entry at the end of the file
        const updatedData = `${data.trim()}\n${entry}\n`;

        // Write the updated .gitignore back to the file
        await writeFileAsync(gitignorePath, updatedData);

        spinner.succeed(`File .gitignore updated.`);
      } else {
        spinner.info(`${entry} is already listed in .gitignore.`);
      }
    } catch (err) {
      spinner.fail('Failed to update .gitignore');
      console.error('Error:', err);
    }
  });
};
