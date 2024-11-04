import fs from 'fs';
import path from 'path';
import { StaplerState } from '@tonik/create-stapler-app-core/types';

const MAX_DEPTH = 2;

export interface UnfinishedProject {
  projectName: string;
  projectPath: string;
  state: StaplerState;
}

export const findUnfinishedProjects = (
  dir: string,
  depth: number = 0,
  results: UnfinishedProject[] = [],
): UnfinishedProject[] => {
  if (depth > MAX_DEPTH) return results;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Recursively search subdirectories
        findUnfinishedProjects(fullPath, depth + 1, results);
      } else if (file === '.staplerrc') {
        // Found a .staplerrc file, check if the project is unfinished
        const data = fs.readFileSync(fullPath, 'utf-8');
        const state: StaplerState = JSON.parse(data);

        if (isProjectUnfinished(state)) {
          results.push({
            projectName: state.projectName || path.basename(dir),
            projectPath: dir,
            state,
          });
        }
      }
    } catch (error) {
      console.error(`Error accessing ${fullPath}:`, error);
    }
  }

  return results;
};

const isProjectUnfinished = (state: StaplerState): boolean => {
  return Object.values(state.stepsCompleted).some((completed) => !completed);
};
