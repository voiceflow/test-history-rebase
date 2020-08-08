import { generatePath } from 'react-router-dom';

import client from '@/client';
import { Path } from '@/config/routes';
import { InteractionModelTabType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { Skill as SkillModel } from '@/models';
import { GetState, SyncThunk, Thunk, ThunkDispatch } from '@/store/types';

import { goTo, goToCanvasCommenting, goToPrototype, goToPublish } from './actions';

const switchRealtime = async (dispatch: ThunkDispatch, getState: GetState, versionID: string, diagramID: string, isNewDiagram?: boolean) => {
  const state = getState();
  const isRealtimeConnected = Realtime.isRealtimeConnectedSelector(state);
  const realtimeDiagramID = Realtime.realtimeDiagramIDSelector(state);

  // switch the realtime connection to a new diagram
  if (isRealtimeConnected && realtimeDiagramID !== diagramID) {
    try {
      const locks = isNewDiagram
        ? await client.socket.diagram.initialize(versionID, diagramID)
        : await client.socket.diagram.switch(versionID, diagramID);

      dispatch(Realtime.initializeRealtime(diagramID, locks));
    } catch {
      dispatch(Modal.setError('Error Switching Flows'));
    }
  }
};

export const goToCanvas = (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk => async (dispatch, getState) => {
  await switchRealtime(dispatch, getState, versionID, diagramID, isNewDiagram);

  dispatch(goTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`));
};

export const goToCurrentCanvas = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToCurrentCanvasCommenting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  await switchRealtime(dispatch, getState, versionID, diagramID);

  dispatch(goToCanvasCommenting(versionID, diagramID));
};

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const skill = Skill.activeSkillSelector(getState()) as SkillModel;

  dispatch(goToCanvas(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToDiagramCommenting = (diagramID: string): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  await switchRealtime(dispatch, getState, versionID, diagramID);
  dispatch(goToCanvasCommenting(versionID, diagramID));
};

export const goToCurrentPrototype = (): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToPrototype(versionID));
};

export const goToActivePlatformPublish = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const platform = Skill.activePlatformSelector(state);

  dispatch(goToPublish(versionID, platform));
};

export const goToCurrentCanvasInteractionModel = (entityType: InteractionModelTabType): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goTo(generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType: entityType })));
};

export const goToCurrentCanvasInteractionModelEntity = (entityType: InteractionModelTabType, entityID: string): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goTo(generatePath(Path.CANVAS_MODEL_ENTITY, { versionID, diagramID, modelType: entityType, modelEntityID: entityID })));
};
