import { AlexaProjectData, AlexaProjectMemberData, AlexaVersionData } from '@voiceflow/alexa-types';
import { GoogleProjectData, GoogleProjectMemberData, GoogleVersionData } from '@voiceflow/google-types';

import client from '@/client';
import clientV2, { getPlatformService } from '@/clientV2';
import creatorAdapter from '@/clientV2/adapters/creator';
import intentAdapter from '@/clientV2/adapters/intent';
import projectAdapter, { productAdapter } from '@/clientV2/adapters/project';
import slotAdapter from '@/clientV2/adapters/slot';
import versionAdapter from '@/clientV2/adapters/version';
import { PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as DiagramReducer from '@/ducks/diagram';
import * as Diagram from '@/ducks/diagramV2';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/productV2';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as Viewport from '@/ducks/viewport';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';
import { storeLogger } from '@/store/utils';

import { Thunk } from './types';

export const importProject = (projectID: string, workspaceID: string): Thunk<Models.Project> => async (dispatch, getState) => {
  const project = await clientV2.api.project.get(projectID);

  const activeWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  const service = getPlatformService(project.platform as PlatformType);
  const copiedProject = projectAdapter.fromDB(await service.project.copy(project._id, { teamID: workspaceID }));

  if (activeWorkspaceID === workspaceID) {
    dispatch(Project.addProject(copiedProject.id, copiedProject));
    await dispatch(ProjectList.addProjectToDefaultList(copiedProject.id));
  } else {
    const projectLists = await client.projectList.find(workspaceID);
    dispatch(ProjectList.addToListInWorkspace(workspaceID, projectLists, copiedProject.id));
  }

  return copiedProject;
};

export const copyProject = (projectID: string, workspaceID: string, listID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const project = Project.projectByIDSelector(state)(projectID);

  if (!project) throw new Error();

  const service = getPlatformService(project.platform);
  const copiedProject = projectAdapter.fromDB(await service.project.copy(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` }));

  dispatch(Project.addProject(copiedProject.id, copiedProject));

  if (listID) dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
};

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const { diagram: DBDiagram, timestamp } = await clientV2.api.diagram.getRTC(diagramID);

  const { offsetX: x, offsetY: y, zoom, variables } = DBDiagram;

  const creator = creatorAdapter.fromDB(DBDiagram, { platform });

  dispatch(DiagramReducer.updateDiagramVariables(diagramID, variables));
  dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(timestamp));
  dispatch(Creator.saveHistory());
};

// eslint-disable-next-line import/prefer-default-export
export const loadVersion = (versionID: string, diagramID: string): Thunk<Models.Skill> => async (dispatch, getState) => {
  const platform = Skill.activePlatformSelector(getState());

  const [dbVersion] = await Promise.all([
    clientV2.api.version.get<AlexaVersionData | GoogleVersionData>(versionID),
    dispatch(Diagram.loadVersionDiagrams(versionID)),
    dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users')),
  ] as const);

  const dbProject = await clientV2.api.project.get<AlexaProjectData | GoogleProjectData, AlexaProjectMemberData | GoogleProjectMemberData>(
    dbVersion.projectID
  );

  const project = projectAdapter.fromDB(dbProject);

  // use the project name instead of the version name
  const skill = versionAdapter.fromDB({ ...dbVersion, name: project.name }, { platform: dbProject.platform as PlatformType });

  dispatch(Creator.resetCreator());

  const slots = slotAdapter.mapFromDB(dbVersion.platformData.slots);
  const intents = intentAdapter(platform).mapFromDB(dbVersion.platformData.intents);
  const products = 'products' in dbProject.platformData ? productAdapter.mapFromDB(Object.values(dbProject.platformData.products)) : [];

  dispatch(Product.replaceProducts(products));
  dispatch(Intent.replaceIntents(intents));
  dispatch(Slot.replaceSlots(slots));
  dispatch(Project.addProject(project.id, project));
  dispatch(Skill.setActiveSkill(skill, diagramID));

  return skill;
};
