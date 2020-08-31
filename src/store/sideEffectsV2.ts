import { AlexaVersionData } from '@voiceflow/alexa-types';

import clientV2, { getPlatformService } from '@/clientV2';
import creatorAdapter from '@/clientV2/adapters/creator';
import { alexaIntentAdapter } from '@/clientV2/adapters/intent';
import projectAdapter from '@/clientV2/adapters/project';
import slotAdapter from '@/clientV2/adapters/slot';
import versionAdapter from '@/clientV2/adapters/version';
import { PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as DiagramReducer from '@/ducks/diagram';
import * as Diagram from '@/ducks/diagramV2';
import * as Intent from '@/ducks/intent';
// import * as Integration from '@/ducks/integration';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as Viewport from '@/ducks/viewport';
import * as Models from '@/models';

import { Thunk } from './types';

export const copyProject = (projectID: string, workspaceID: string, listID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const project = Project.projectByIDSelector(state)(projectID);
  if (!project) throw new Error();

  const service = getPlatformService(project.platform);
  const copiedProject = projectAdapter.fromDB(await service.copyProject(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` }));

  dispatch(Project.addProject(copiedProject.id, copiedProject));

  if (listID) dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
};

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const DBDiagram = await clientV2.api.diagram.get(diagramID);

  const { offsetX: x, offsetY: y, zoom, modified, variables } = DBDiagram;

  const creator = creatorAdapter.fromDB(DBDiagram, platform);

  dispatch(DiagramReducer.updateDiagramVariables(diagramID, variables));
  dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(modified));
  dispatch(Creator.saveHistory());
};

// eslint-disable-next-line import/prefer-default-export
export const loadVersion = (versionID: string, diagramID: string): Thunk<Models.Skill> => async (dispatch) => {
  const [dbVersion] = await Promise.all([
    clientV2.api.version.get<AlexaVersionData>(versionID),
    dispatch(Diagram.loadVersionDiagrams(versionID)),
  ] as const);
  const dbProject = await clientV2.api.project.get(dbVersion.projectID);

  const project = projectAdapter.fromDB(dbProject);
  // use the project name instead of the version name
  const skill = versionAdapter.fromDB({ ...dbVersion, name: project.name }, { platform: dbProject.platform as PlatformType });

  dispatch(Creator.resetCreator());

  // try {
  //   await dispatch(Integration.fetchIntegrationUsers());
  // } catch (err) {
  //   storeLogger.warn('Unable to fetch integration users');
  // }

  // TODO: Adapt Products, etc.
  const intents = alexaIntentAdapter.mapFromDB(dbVersion.platformData.intents);
  const slots = slotAdapter.mapFromDB(dbVersion.platformData.slots);

  dispatch(Intent.replaceIntents(intents));
  dispatch(Slot.replaceSlots(slots));
  dispatch(Project.addProject(project.id, project));
  dispatch(Skill.setActiveSkill(skill, diagramID));

  return skill;
};
