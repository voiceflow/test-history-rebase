import { AlexaProject, AlexaProjectData, AlexaProjectMemberData } from '@voiceflow/alexa-types';

import clientV2 from '@/clientV2';
import creatorAdapter from '@/clientV2/adapters/creator';
import projectAdapter from '@/clientV2/adapters/project';
import versionAdapter from '@/clientV2/adapters/version';
import { PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
// import * as Integration from '@/ducks/integration';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as VariableSet from '@/ducks/variableSet';
import * as Viewport from '@/ducks/viewport';
import * as Models from '@/models';

import { Thunk } from './types';
// import { storeLogger } from './utils';

export const initializeCreatorForDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const DBDiagram = await clientV2.api.diagram.get(diagramID);

  const { offsetX: x, offsetY: y, zoom, modified, variables } = DBDiagram;

  const creator = creatorAdapter.fromDB(DBDiagram, platform);

  dispatch(VariableSet.replaceVariableSetDiagram(diagramID, variables));
  dispatch(Viewport.rehydrateViewport(diagramID, { x, y, zoom }));
  dispatch(Creator.initializeCreator({ ...creator, diagramID: creator.diagramID !== diagramID ? diagramID : creator.diagramID }));
  dispatch(Realtime.updateLastTimestamp(modified));
  dispatch(Creator.saveHistory());
};

// eslint-disable-next-line import/prefer-default-export
export const loadVersion = (versionID: string, diagramID: string): Thunk<Models.Skill> => async (dispatch) => {
  const version = await clientV2.api.version.get(versionID);
  const dbProject = await clientV2.api.project.get<AlexaProjectData, AlexaProjectMemberData>(version.projectID);

  const project = projectAdapter.fromDB(dbProject as AlexaProject);
  // use the project name instead of the version name
  const skill = versionAdapter.fromDB({ ...version, name: project.name }, { platform: dbProject.platform as PlatformType });

  dispatch(Creator.resetCreator());

  // try {
  //   await dispatch(Integration.fetchIntegrationUsers());
  // } catch (err) {
  //   storeLogger.warn('Unable to fetch integration users');
  // }

  // TODO: Adapt Intents, Slots, Products, etc.
  // const intents = extractIntents(body);
  // const slots = extractSlots(body);
  // dispatch(Intent.replaceIntents(intents));
  // dispatch(Slot.replaceSlots(slots));
  dispatch(Project.addProject(project.id, project));
  dispatch(Skill.setActiveSkill(skill, diagramID));

  return skill;
};
