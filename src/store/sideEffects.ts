import { AlexaProjectData, AlexaProjectMemberData, AlexaVersionData } from '@voiceflow/alexa-types';
import { Member } from '@voiceflow/api-sdk';
import { replaceVariables } from '@voiceflow/common';
import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';
import { GoogleProjectData, GoogleProjectMemberData, GoogleVersionData } from '@voiceflow/google-types';

import client from '@/client';
import creatorAdapter from '@/client/adapters/creator';
import intentAdapter from '@/client/adapters/intent';
import projectAdapter, { productAdapter } from '@/client/adapters/project';
import slotAdapter from '@/client/adapters/slot';
import versionAdapter from '@/client/adapters/version';
import { PlatformType } from '@/constants';
import * as Account from '@/ducks/account';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Prototype from '@/ducks/prototype';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as Viewport from '@/ducks/viewport';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';
import { storeLogger } from '@/store/utils';

import { Thunk } from './types';

export const importProject = (projectID: string, workspaceID: string): Thunk<Models.Project> => async (dispatch, getState) => {
  const project = await client.api.project.get(projectID);

  const activeWorkspaceID = Workspace.activeWorkspaceIDSelector(getState());

  const copiedProject = projectAdapter.fromDB(
    await client.platform(project.platform as PlatformType).project.copy(project._id, { teamID: workspaceID })
  );

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

  const copiedProject = projectAdapter.fromDB(
    await client.platform(project.platform).project.copy(project.id, { teamID: workspaceID, name: `${project.name} (COPY)` })
  );

  dispatch(Project.addProject(copiedProject.id, copiedProject));

  if (listID) dispatch(ProjectList.addProjectToList(listID, copiedProject.id));
};

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const { diagram: DBDiagram, timestamp } = await client.api.diagram.getRTC(diagramID);

  const { offsetX: x, offsetY: y, zoom, variables } = DBDiagram;

  const creator = creatorAdapter.fromDB(DBDiagram, { platform });

  dispatch(Diagram.updateDiagramVariables(diagramID, variables));
  dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(timestamp));
  dispatch(Creator.saveHistory());
};

// eslint-disable-next-line import/prefer-default-export
export const loadVersion = (versionID: string, diagramID: string): Thunk<Models.Skill<string>> => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const userID = Account.userIDSelector(state);

  const [dbVersion] = await Promise.all([
    client.api.version.get<AlexaVersionData | GoogleVersionData>(versionID),
    dispatch(Diagram.loadVersionDiagrams(versionID)),
  ] as const);

  // not a dependency for project to load
  dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

  const dbProject = await client.api.project.get<AlexaProjectData | GoogleProjectData, AlexaProjectMemberData | GoogleProjectMemberData>(
    dbVersion.projectID
  );

  const project = projectAdapter.fromDB(dbProject);

  // use the project name instead of the version name
  const skill = versionAdapter.fromDB({ ...dbVersion, name: project.name }, { platform: dbProject.platform as PlatformType });

  // temporary setup until we refactor the skill duck and move vendor/amazonID to project
  const member = dbProject.members.find(({ creatorID }) => creatorID === userID);
  if (member) {
    const {
      platformData: { selectedVendor, vendors },
    } = member as Member<AlexaProjectMemberData>;
    skill.publishInfo.alexa.amznID = vendors?.find(({ vendorID }) => vendorID === selectedVendor)?.skillID ?? null;
    skill.publishInfo.alexa.vendorId = selectedVendor;
  }

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

export const resolveAPL = ({
  title,
  aplType,
  imageURL,
  document,
  datasource,
  aplCommands,
}: APLStepData): Thunk<{ apl: string; data: string; commands: string }> => async (_, getState) => {
  const state = getState();
  const variables = Prototype.prototypeVariablesSelector(state);
  const commands = aplCommands || '';

  let data = datasource || '';
  let apl = document || '';

  if (aplType === APLType.SPLASH) {
    ({ document: apl, datasource: data } = await client.platform.alexa.handlers.getDisplayWithDatasource(title || '', imageURL || ''));
  }

  if (variables && data) {
    data = replaceVariables(data, variables);
  }

  return { apl, data, commands };
};
