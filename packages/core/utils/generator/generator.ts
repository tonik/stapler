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

export const templateGenerator = (template: Template, sourcePath: string) => {
    // copy files from template project to new project
    // rename files if needed

    template.forEach((templateFilesObject) => {
        // copy files
        templateFilesObject.files.forEach((file) => {
            // copy file
            const destination = path.join(process.cwd(), templateFilesObject.path, file);
            fs.copyFileSync(sourcePath, destination);
      
            // rename files
            if (templateFilesObject.rename) {
                templateFilesObject.rename.forEach((rename) => {
                    // rename file
                    const destination = path.join(process.cwd(), templateFilesObject.path, rename.to);
                    fs.renameSync(sourcePath, destination);
                });
            }
        });
    });
};