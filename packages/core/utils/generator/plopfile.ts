import fs from 'fs-extra';
import path from 'path';
import { NodePlopAPI } from 'plop';

interface RenameConfig {
  from: string;
  to: string;
}

interface CopyAndRenameConfig {
  files: string[];
  rename?: RenameConfig[];
  sourcePath: string;
  destinationPath: string;
}

export default function (plop: NodePlopAPI) {
  plop.setActionType('copyAndRename', async (_answers: any, config: unknown, plopInstance: any) => {
    const { files, rename, sourcePath, destinationPath } = config as unknown as CopyAndRenameConfig;
  
    // Ensure destination folder exists
    fs.ensureDirSync(destinationPath);
  
    // Copy each file from the source to the destination
    for (const file of files) {
      const sourceFile = path.join(sourcePath, file);
      const destFile = path.join(destinationPath, file);
  
      try {
        fs.copySync(sourceFile, destFile);
        console.log(`Copied: ${file} -> ${destFile}`);
      } catch (error) {
        console.error(`Error copying file ${file}:`, error);
      }
    }
  
    // Rename if necessary
    if (rename && rename.length > 0) {
      for (const { from, to } of rename) {
        const oldPath = path.join(destinationPath, from);
        const newPath = path.join(destinationPath, to);
  
        try {
          if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${from} -> ${to}`);
          } else {
            console.warn(`File to rename not found: ${oldPath}`);
          }
        } catch (error) {
          console.error(`Error renaming file ${from}:`, error);
        }
      }
    }
  
    return 'Files copied and renamed successfully!';
  });
  
  plop.setGenerator('installSupabase', {
    description: 'Set up Supabase files',
    actions: [
      {
        type: 'copyAndRename',
        data: {
          files: [
            'client.ts',
            'index.ts',
            'middleware.ts',
            'server.ts',
          ],
          rename: [
            { from: 'next_api_endpoint.ts', to: 'route.ts' }
          ],
          sourcePath: path.join(__dirname, 'templates', 'supabase'),
          destinationPath: path.join(process.cwd(), 'supabase')
        }
      },
      {
        type: 'copyAndRename',
        data: {
          files: [
            'next_api_endpoint.ts',
          ],
          rename: [
            { from: 'next_api_endpoint.ts', to: 'route.ts' }
          ],
          sourcePath: path.join(__dirname, 'templates', 'api'),
          destinationPath: path.join(process.cwd(), 'src/app/api/')
        }
      }
    ]
  });
}
