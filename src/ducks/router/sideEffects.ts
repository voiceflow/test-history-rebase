import queryString from 'query-string';
import { generatePath } from 'react-router-dom';

import client from '@/client';
import { Path } from '@/config/routes';
import { InteractionModelTabType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import { Skill as SkillModel } from '@/models';
import { GetState, SyncThunk, Thunk, ThunkDispatch } from '@/store/types';

import { goTo, goToCanvasCommenting, goToPrototype, goToPublish, goToSettings, redirectToCanvasCommenting } from './actions';

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

export const goToCanvas = (versionID: string, diagramID: string) =>
  goTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const goToCanvasSwitchRealtime = (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk => async (dispatch, getState) => {
  await switchRealtime(dispatch, getState, versionID, diagramID, isNewDiagram);

  dispatch(goToCanvas(versionID, diagramID));
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

  dispatch(goToCanvasCommenting(versionID, diagramID));
};

export const redirectToCurrentCanvasCommenting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(redirectToCanvasCommenting(versionID, diagramID));
};

export const goToCurrentCanvasMarkup = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Skill.activeSkillIDSelector(state);
  const diagramID = Skill.activeDiagramIDSelector(state);

  dispatch(goTo(`${generatePath(Path.CANVAS_MARKUP, { versionID, diagramID })}${window.location.search}`));
};

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const skill = Skill.activeSkillSelector(getState()) as SkillModel;

  await dispatch(goToCanvasSwitchRealtime(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  await dispatch(goToCanvasSwitchRealtime(versionID, diagramID));
};

export const goToDiagramCommenting = (diagramID: string, threadID?: string): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  await switchRealtime(dispatch, getState, versionID, diagramID);
  dispatch(goToCanvasCommenting(versionID, diagramID, `?${queryString.stringify({ thread: threadID })}`));
};

export const goToCurrentPrototype = (): SyncThunk => (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToPrototype(versionID));
};

export const goToCurrentSettings = (): Thunk => async (dispatch, getState) => {
  const versionID = Skill.activeSkillIDSelector(getState());

  dispatch(goToSettings(versionID));
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
