import fs from 'fs';
import path from 'path';

interface TemplateFilesObject {
  path: string;
  files: string[];
  rename?: {
    from: string;
    to: string;
  }[];
}
export type Template = TemplateFilesObject[];

export const templateGenerator = (filesConfig: Template, templateDir: string, destinationDir: string) => {
  filesConfig.forEach(({ path: filePath, files, rename }) => {
    const fullPath = path.join(destinationDir, filePath);
    fs.mkdirSync(fullPath, { recursive: true }); // Create the directory if it doesn't exist

    files.forEach((file) => {
      const sourceFile = path.join(templateDir, file);
      const destinationFile = path.join(fullPath, file);

      // Copy the file from the template directory to the destination
      fs.copyFileSync(sourceFile, destinationFile);
      console.log(`🖇️ Copied ${sourceFile} to ${destinationFile}`);
    });

    // Handle renaming if applicable
    if (rename) {
      rename.forEach(({ from, to }) => {
        const originalFilePath = path.join(fullPath, from);
        const renamedFilePath = path.join(fullPath, to);

        fs.renameSync(originalFilePath, renamedFilePath);
        console.log(`🖇️ Renamed ${originalFilePath} to ${renamedFilePath}`);
      });
    }
  });
};
