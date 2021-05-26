import client from '@/client';
import projectAdapter from '@/client/adapters/project';
import { PlatformType } from '@/constants';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Session from '@/ducks/session';
import * as Models from '@/models';

import { Thunk } from './types';

export const importProject = (projectID: string, workspaceID: string): Thunk<Models.AnyProject> => async (dispatch, getState) => {
  const project = await client.api.project.get(projectID);

  const activeWorkspaceID = Session.activeWorkspaceIDSelector(getState());

  const copiedProject = projectAdapter.fromDB(
    await client.platform(project.platform as PlatformType).project.copy(project._id, { teamID: workspaceID })
  );

  if (activeWorkspaceID === workspaceID) {
    dispatch(Project.addProject(copiedProject.id, copiedProject));
    await dispatch(ProjectList.addProjectToDefaultList(copiedProject.id));
  } else {
    const projectLists = await client.projectList.find(workspaceID);
    dispatch(ProjectList.saveProjectToList(workspaceID, projectLists, copiedProject.id));
  }

  return copiedProject;
};

export const copyProject = (projectID: string, workspaceID: string, listID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const project = Project.projectByIDSelector(state)(projectID);

  if (!project) throw new Error();

  const copiedProject = projectAdapter.fromDB(
    await client.platform(project.platform).project.copy(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` })
  );

  dispatch(Project.addProject(copiedProject.id, copiedProject));

  if (listID) dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
};
