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

export const templateGenerator = (template: Template, templateDir: string, destinationDir: string) => {
  template.forEach((templateFilesObject) => {
    templateFilesObject.files.forEach((file) => {
      // Construct source and destination paths
      const source = path.join(templateDir, file);
      console.log(source);
      const destination = path.join(destinationDir, templateFilesObject.path, file);
      fs.copyFileSync(source, destination);

      // Handle file renaming if needed
      if (templateFilesObject.rename) {
        templateFilesObject.rename.forEach((rename) => {
          const oldPath = path.join(process.cwd(), templateFilesObject.path, rename.from);
          const newPath = path.join(process.cwd(), templateFilesObject.path, rename.to);
          fs.renameSync(oldPath, newPath);
        });
      }
    });
  });
};