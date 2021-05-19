import { AlexaProjectData, AlexaProjectMemberData, AlexaVersionData } from '@voiceflow/alexa-types';
import { replaceVariables } from '@voiceflow/common';
import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';
import { GoogleProjectData, GoogleProjectMemberData, GoogleVersionData } from '@voiceflow/google-types';
import { batch } from 'react-redux';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import projectAdapter, { productAdapter } from '@/client/adapters/project';
import slotAdapter from '@/client/adapters/slot';
import versionAdapter from '@/client/adapters/version';
import { PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Integration from '@/ducks/integration';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as Workspace from '@/ducks/workspace';
import * as Models from '@/models';
import { storeLogger } from '@/store/utils';

import { Thunk } from './types';

export const importProject = (projectID: string, workspaceID: string): Thunk<Models.AnyProject> => async (dispatch, getState) => {
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

// eslint-disable-next-line import/prefer-default-export
export const loadVersion = (versionID: string, diagramID: string): Thunk<Models.Skill<string>> => async (dispatch, getState) => {
  const state = getState();
  const platform = Project.activePlatformSelector(state);

  const [dbVersion] = await Promise.all([
    client.api.version.get<AlexaVersionData | GoogleVersionData>(versionID),
    dispatch(Diagram.loadDiagrams(versionID)),
  ] as const);

  // not a dependency for project to load
  dispatch(Integration.fetchIntegrationUsers()).catch(() => storeLogger.warn('Unable to fetch integration users'));

  const dbProject = await client.api.project.get<AlexaProjectData | GoogleProjectData, AlexaProjectMemberData | GoogleProjectMemberData>(
    dbVersion.projectID
  );

  const project = projectAdapter.fromDB(dbProject);

  // use the project name instead of the version name
  const skill = versionAdapter.fromDB({ ...dbVersion, name: project.name }, { platform: dbProject.platform as PlatformType });

  dispatch(Creator.resetCreator());

  const slots = slotAdapter.mapFromDB(dbVersion.platformData.slots);
  const intents = intentAdapter(platform).mapFromDB(dbVersion.platformData.intents);
  const products = 'products' in dbProject.platformData ? productAdapter.mapFromDB(Object.values(dbProject.platformData.products)) : [];

  batch(() => {
    dispatch(Product.replaceProducts(products));
    dispatch(Intent.replaceIntents(intents));
    dispatch(Slot.replaceSlots(slots));
    dispatch(Project.addProject(project.id, project));
    dispatch(Skill.setActiveSkill(skill, diagramID));

    dispatch(Session.setActiveDiagramID(diagramID || dbVersion.rootDiagramID));
    dispatch(Session.setActiveProjectID(dbVersion.projectID));
    dispatch(Session.setActiveVersionID(versionID));
    dispatch(Session.setActiveWorkspaceID(dbProject.teamID));

    dispatch(
      Prototype.updatePrototypeSettings(
        {
          ...dbVersion.prototype?.settings,
          layout: dbVersion.prototype?.settings.layout ?? Prototype.PrototypeLayout.TEXT_DIALOG,
        } as Prototype.PrototypeSettings,
        false
      )
    );
  });

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
