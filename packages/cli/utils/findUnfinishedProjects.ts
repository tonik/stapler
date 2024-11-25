import fs from 'fs';
import path from 'path';
import { StaplerState } from 'stplr-core/types';

const MAX_DEPTH = 2;

export interface UnfinishedProject {
  projectName: string;
  projectPath: string;
  state: StaplerState;
}

const findStaplerConfigFiles = (dir: string, depth: number = 0): string[] => {
  if (depth > MAX_DEPTH) return [];

  const files = fs.readdirSync(dir);
  const configFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        configFiles.push(...findStaplerConfigFiles(fullPath, depth + 1));
      } else if (file === '.staplerrc') {
        configFiles.push(fullPath);
      }
    } catch (error) {
      console.error(`Error accessing ${fullPath}:`, error);
    }
  }

  return configFiles;
};

const readStaplerConfig = (filePath: string): StaplerState | null => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const isProjectFinished = (state: StaplerState): boolean => {
  return Object.values(state.stepsCompleted).every((completed) => completed);
};

export const findUnfinishedProjects = (dir: string): UnfinishedProject[] => {
  const configFiles = findStaplerConfigFiles(dir);
  const results: UnfinishedProject[] = [];

  for (const filePath of configFiles) {
    const state = readStaplerConfig(filePath);

    if (state && !isProjectFinished(state)) {
      results.push({
        projectName: state.projectName || path.basename(path.dirname(filePath)),
        projectPath: path.dirname(filePath),
        state,
      });
    }
  }

  return results;
};
