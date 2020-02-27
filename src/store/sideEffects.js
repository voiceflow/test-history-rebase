import client from '@/client';
import skillAdapter, { extractIntents, extractProject, extractSlots } from '@/client/adapters/skill';
import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import { loadDisplaysForSkill } from '@/ducks/display';
import { fetchIntegrationUsers } from '@/ducks/integration';
import { replaceIntents } from '@/ducks/intent';
import { addProjectToList } from '@/ducks/lists';
import { loadProductsForSkill } from '@/ducks/product';
import { addProject, projectByIDSelector } from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { replaceSlots } from '@/ducks/slot';
import { replaceVariableSetDiagram, saveVariableSet } from '@/ducks/variableSet';
import { rehydrateViewport } from '@/ducks/viewport';
import * as Workspace from '@/ducks/workspace';

export const resetDiagram = () => async (dispatch, getState) => {
  const rootDiagramID = Skill.rootDiagramIDSelector(getState());

  dispatch(Skill.updateDiagramID(rootDiagramID));
};

export const copyProject = (projectID, workspaceID, boardID) => async (dispatch, getState) => {
  const state = getState();
  const project = projectByIDSelector(state)(projectID);
  if (!project) throw new Error();

  let copiedProject = null;
  if (project.module) {
    copiedProject = await client.project.copyReference(project.module, workspaceID);
  } else {
    copiedProject = await client.project.copy(project.versionID, workspaceID);
  }

  dispatch(addProject(copiedProject.id, copiedProject));
  if (boardID) {
    await dispatch(addProjectToList(boardID, copiedProject.id));
  }
};

export const importProject = (workspaceID, importToken) => async (dispatch, getState) => {
  const importedProject = await client.project.import(importToken, workspaceID);
  const activeWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());
  if (activeWorkspaceID === workspaceID) {
    dispatch(addProject(importedProject.id, importedProject));
    await dispatch(addProjectToList(null, importedProject.id));
  }
};

export const initializeCreatorForDiagram = (diagramID) => async (dispatch, getState) => {
  const platform = Skill.activePlatformSelector(getState());
  const {
    data: { viewport, ...creator },
    timestamp,
    variables,
  } = await client.diagram.getData(diagramID, platform);

  dispatch(replaceVariableSetDiagram(diagramID, variables));
  dispatch(rehydrateViewport(diagramID, viewport));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(timestamp));
  dispatch(Creator.saveHistory());
};

export const loadSkill = (skillID, diagramID) => async (dispatch) => {
  const [body] = await Promise.all([
    client.skill.get(skillID),
    dispatch(Diagram.loadDiagramsForSkill(skillID)),
    dispatch(loadProductsForSkill(skillID)),
    dispatch(loadDisplaysForSkill(skillID)),
  ]);

  const skill = skillAdapter.fromDB(body);
  const project = extractProject(body);
  const intents = extractIntents(body);
  const slots = extractSlots(body);

  dispatch(Creator.resetCreator());

  try {
    await dispatch(fetchIntegrationUsers());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Unable to fetch integration users');
  }

  dispatch(replaceIntents(intents));
  dispatch(replaceSlots(slots));
  dispatch(addProject(project.id, project));
  dispatch(Skill.setActiveSkill(skill, diagramID));

  return skill;
};

export const saveVariableSets = () => async (dispatch, getState) => {
  const diagrams = Diagram.allDiagramsSelector(getState());

  await Promise.all(diagrams.map((diagram) => dispatch(saveVariableSet(diagram.id))));
};

export const savePlatformAndActiveDiagram = () => (dispatch) => Promise.all([dispatch(Skill.savePlatform()), dispatch(Diagram.saveActiveDiagram())]);

export const handleRealtimeSessionCancelled = (data) => async (dispatch, getState) => {
  const currentWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await dispatch(Workspace.removeWorkspace(data.workspaceId));

  if (currentWorkspaceID === data.workspaceId) {
    dispatch(Router.goToDashboard());
  }

  toast.info(`You are no longer a collaborator for "${data.workspaceName}" workspace`);
};
