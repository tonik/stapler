import inquirer from 'inquirer';
import { ProjectChoice, UnfinishedProject } from '../utils/findUnfinishedProjects';
import { LABEL_WIDTH, SPACING } from 'stplr-utils';

export type UnfinishedProjectsChoiceAnswers = {
  resume: boolean;
  unfinishedSelectedProject: UnfinishedProject;
};

/**
 * Prompts the user to select an unfinished project to resume.
 *
 * @param unfinishedProjects - An array of unfinished projects.
 * @param projectChoices - An array of project choices presented to the user.
 * @returns A promise that returns object with resume boolean value and selected project.
 *
 **/

const leftPadding = ' '.repeat(LABEL_WIDTH + SPACING);

export const unfinishedProjectsChoice = async (
  unfinishedProjects: UnfinishedProject[],
  projectChoices: ProjectChoice[],
): Promise<UnfinishedProjectsChoiceAnswers> => {
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'resume',
      message: `We found the following unfinished project(s):\n${unfinishedProjects
        .map((p) => `- ${p.projectName}`)
        .join('\n')}\nWould you like to resume one of them?`,
      default: true,
    },
    {
      type: 'list',
      name: 'unfinishedSelectedProject',
      message: 'Select a project to resume:',
      choices: projectChoices,
      when: (answers) => answers.resume && unfinishedProjects.length > 1,
    },
  ]);
};
