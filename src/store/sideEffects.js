import client from '@/client';
import skillAdapter, { extractIntents, extractProject, extractSlots } from '@/client/adapters/skill';
import { addProjectToList } from '@/ducks/board';
import { initializeCreator, resetCreator } from '@/ducks/creator';
import { allDiagramsSelector, loadDiagramsForSkill, saveActiveDiagram } from '@/ducks/diagram';
import { loadDisplaysForSkill } from '@/ducks/display';
import { fetchIntegrationUsers } from '@/ducks/integration';
import { replaceIntents } from '@/ducks/intent';
import { loadProductsForSkill } from '@/ducks/product';
import { addProject, projectByIDSelector } from '@/ducks/project';
import { activePlatformSelector, rootDiagramIDSelector, savePlatform, setActiveSkill, updateDiagramID } from '@/ducks/skill';
import { replaceSlots } from '@/ducks/slot';
import { loadVariableSetForDiagram, saveVariableSet } from '@/ducks/variableSet';
import { rehydrateViewport } from '@/ducks/viewport';

export const resetDiagram = () => async (dispatch, getState) => {
  const rootDiagramID = rootDiagramIDSelector(getState());

  dispatch(updateDiagramID(rootDiagramID));
};

export const copyProject = (projectID, teamID, boardID) => async (dispatch, getState) => {
  const state = getState();
  const project = projectByIDSelector(state)(projectID);
  if (!project) throw new Error();

  let copiedProject = null;
  if (project.module) {
    copiedProject = await client.project.copyReference(project.module, teamID);
  } else {
    copiedProject = await client.project.copy(project.versionID, teamID);
  }

  dispatch(addProject(copiedProject.id, copiedProject));
  if (boardID) dispatch(addProjectToList(boardID, copiedProject.id));
};

export const importProject = (teamID, importToken) => async (dispatch, getState) => {
  const importedProject = await client.project.import(importToken, teamID);
  const currentTeam = getState().team.team_id;
  if (currentTeam === teamID) {
    dispatch(addProject(importedProject.id, importedProject));
    dispatch(addProjectToList(null, importedProject.id));
  }
};

export const initializeCreatorForDiagram = (diagramID) => async (dispatch, getState) => {
  const platform = activePlatformSelector(getState());
  const { viewport, ...creator } = await client.diagram.getData(diagramID, platform);

  dispatch(rehydrateViewport(diagramID, viewport));
  dispatch(initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));

  dispatch(loadVariableSetForDiagram(diagramID));
};

export const loadSkill = (skillID, diagramID) => async (dispatch) => {
  const [body] = await Promise.all([
    client.skill.get(skillID),
    dispatch(loadDiagramsForSkill(skillID)),
    dispatch(loadProductsForSkill(skillID)),
    dispatch(loadDisplaysForSkill(skillID)),
  ]);

  const skill = skillAdapter.fromDB(body);
  const project = extractProject(body);
  const intents = extractIntents(body);
  const slots = extractSlots(body);

  dispatch(resetCreator());

  try {
    await dispatch(fetchIntegrationUsers());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Unable to fetch integration users');
  }

  dispatch(replaceIntents(intents));
  dispatch(replaceSlots(slots));
  dispatch(addProject(project.id, project));
  dispatch(setActiveSkill(skill, diagramID));

  return skill;
};

export const saveVariableSets = () => async (dispatch, getState) => {
  const diagrams = allDiagramsSelector(getState());

  await Promise.all(diagrams.map((diagram) => dispatch(saveVariableSet(diagram.id))));
};

export const savePlatformAndActiveDiagram = () => (dispatch) => Promise.all([dispatch(savePlatform()), dispatch(saveActiveDiagram())]);
