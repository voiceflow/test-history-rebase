import client from '@/client';
import skillAdapter, { extractIntents, extractProject, extractSlots } from '@/client/adapters/skill';
import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Display from '@/ducks/display';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as VariableSet from '@/ducks/variableSet';
import * as Viewport from '@/ducks/viewport';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';

import { SyncThunk, Thunk } from './types';
import { storeLogger } from './utils';

export const copyProject = (projectID: string, workspaceID: string, listID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const project = Project.projectByIDSelector(state)(projectID);
  if (!project) throw new Error();

  let copiedProject = null;
  if (project.module) {
    copiedProject = await client.project.copyReference(project.module, workspaceID);
  } else {
    copiedProject = await client.project.copy(project.versionID, workspaceID);
  }

  dispatch(Project.addProject(copiedProject.id, copiedProject));
  if (listID) {
    dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
  }
};

export const importProject = (workspaceID: string, importToken: string, addToStart = false): Thunk<Models.Project> => async (dispatch, getState) => {
  const importedProject = await client.project.import(importToken, workspaceID);

  const activeWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  if (activeWorkspaceID === workspaceID) {
    dispatch(Project.addProject(importedProject.id, importedProject));
    await dispatch(ProjectList.addProjectToDefaultList(importedProject.id, addToStart));
  } else {
    const projectLists = await client.projectList.find(workspaceID);
    dispatch(ProjectList.addToListInWorkspace(workspaceID, projectLists, importedProject.id));
  }

  return importedProject;
};

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);

  const {
    data: { viewport, ...creator },
    timestamp,
    variables,
  } = await client.diagram.getData(diagramID, platform);

  dispatch(VariableSet.replaceVariableSetDiagram(diagramID, variables));
  dispatch(Viewport.rehydrateViewport(diagramID, viewport));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(timestamp));
  dispatch(Creator.saveHistory());
};

export const loadSkill = (versionID: string, diagramID: string): Thunk<unknown> => async (dispatch) => {
  const [body] = await Promise.all([
    client.skill.get(versionID),
    dispatch(Diagram.loadDiagramsForSkill(versionID)),
    dispatch(Product.loadProductsForSkill(versionID)),
    dispatch(Display.loadDisplaysForSkill(versionID)),
  ]);

  const skill = skillAdapter.fromDB(body);
  const project: any = extractProject(body);
  const intents = extractIntents(body);
  const slots = extractSlots(body);

  dispatch(Creator.resetCreator());

  try {
    await dispatch(Integration.fetchIntegrationUsers());
  } catch (err) {
    storeLogger.warn('Unable to fetch integration users');
  }

  dispatch(Intent.replaceIntents(intents));
  dispatch(Slot.replaceSlots(slots));
  dispatch(Project.addProject(project.id, project));
  dispatch(Skill.setActiveSkill(skill, diagramID));

  return skill;
};

export const savePlatformAndActiveDiagram = (): SyncThunk => (dispatch) =>
  Promise.all([dispatch(Skill.savePlatform()), dispatch(Diagram.saveActiveDiagram())]);

export const handleRealtimeSessionCancelled = (data: { workspaceId: string; workspaceName: string }): Thunk => async (dispatch, getState) => {
  const currentWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await dispatch(Workspace.removeWorkspace(data.workspaceId));

  if (currentWorkspaceID === data.workspaceId) {
    dispatch(Router.goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${data.workspaceName}" workspace`);
};
