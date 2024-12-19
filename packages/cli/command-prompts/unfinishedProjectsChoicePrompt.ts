import Enquirer from 'enquirer';

import { ProjectChoice, UnfinishedProject } from '../utils/findUnfinishedProjects';
import { LABEL_BG_COLOR, LEFT_PADDING } from 'stplr-utils';
import chalk from 'chalk';

export type UnfinishedProjectsChoiceAnswers = {
  resume: boolean;
  unfinishedSelectedProject: string;
};

export type UnfinishedProjectsChoiceResponse = {
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

export const unfinishedProjectsChoice = async (
  unfinishedProjects: UnfinishedProject[],
  projectChoices: ProjectChoice[],
): Promise<UnfinishedProjectsChoiceResponse> => {
  const enquirer = new Enquirer();
  const formattedProjectChoices = projectChoices.map((choice) => {
    return {
      name: choice.name,
      value: choice.name,
      message: `${chalk.hex(LABEL_BG_COLOR)(LEFT_PADDING + choice.name)}`,
    };
  });

  // we might need to create custom prompt format like in: https://www.npmjs.com/package/enquirer#-custom-prompts
  const shouldResume = (await enquirer.prompt({
    type: 'confirm',
    name: 'resume',
    message: `We found the following unfinished project(s):\n${unfinishedProjects
      .map((p) => `${LEFT_PADDING} - ${p.projectName}`)
      .join('\n')}\n${LEFT_PADDING} Would you like to resume one of them?`,
    initial: true,
    prefix: LEFT_PADDING,
  })) as { resume: boolean };

  if (!shouldResume.resume) {
    return {
      resume: false,
      unfinishedSelectedProject: unfinishedProjects[0],
    };
  }

  const selectProjectAnswer = (await enquirer.prompt({
    type: 'select',
    name: 'unfinishedSelectedProject',
    message: 'Select a project to resume:',
    choices: formattedProjectChoices,
    prefix: LEFT_PADDING,
    // use it only when we want to resume a project
    skip: (state: unknown) => {
      if (typeof state === 'object' && state !== null && 'resume' in state) {
        console.log('state', state);
        return !(state as UnfinishedProjectsChoiceAnswers).resume;
      }
      console.log('state', state);
      return false; // default fallback if not sure
    },
  })) as UnfinishedProjectsChoiceAnswers;

  const selectedProject = unfinishedProjects.find(
    (project) => project.projectName === selectProjectAnswer.unfinishedSelectedProject,
  );

  const response = {
    resume: selectProjectAnswer.resume,
    unfinishedSelectedProject: selectedProject,
  } as UnfinishedProjectsChoiceResponse;

  return response;
};
