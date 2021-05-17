import { generatePath } from 'react-router-dom';

import client from '@/client';
import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import { InteractionModelTabType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { activePlatformSelector, activeSkillSelector } from '@/ducks/skill/skill/selectors';
import { activeWorkspaceIDSelector } from '@/ducks/workspace';
import { Skill as SkillModel } from '@/models';
import { GetState, SyncThunk, Thunk, ThunkDispatch } from '@/store/types';
import * as Query from '@/utils/query';
import * as Sentry from '@/vendors/sentry';

import {
  goTo,
  goToCanvasCommenting,
  goToPrototype,
  goToPublish,
  goToSettings,
  goToWorkspaceSettings,
  redirectTo,
  redirectToCanvasCommenting,
} from './actions';

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
    } catch (err) {
      Sentry.error(err);

      if (err) {
        dispatch(Modal.setError('Error Switching Flows'));
      }
    }
  }
};

export const goToCanvas = (versionID: string, diagramID?: string) =>
  goTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const redirectToCanvas = (versionID: string, diagramID?: string) =>
  redirectTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const goToCanvasSwitchRealtime = (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk => async (dispatch, getState) => {
  await switchRealtime(dispatch, getState, versionID, diagramID, isNewDiagram);

  dispatch(goToCanvas(versionID, diagramID));
};

export const redirectToCanvasSwitchRealtime = (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk => async (dispatch, getState) => {
  await switchRealtime(dispatch, getState, versionID, diagramID, isNewDiagram);

  dispatch(redirectToCanvas(versionID, diagramID));
};

export const goToCurrentCanvas = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvas(versionID, diagramID));
};

export const goToCurrentCanvasCommenting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvasCommenting(versionID, diagramID));
};

export const redirectToCurrentCanvasCommenting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(redirectToCanvasCommenting(versionID, diagramID));
};

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const skill = activeSkillSelector(getState()) as SkillModel<string>;

  await dispatch(goToCanvasSwitchRealtime(skill.id, skill.rootDiagramID));
};

export const redirectToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const skill = activeSkillSelector(getState()) as SkillModel<string>;

  await dispatch(redirectToCanvasSwitchRealtime(skill.id, skill.rootDiagramID));
};

export const goToDiagram = (diagramID: string): Thunk => async (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  await dispatch(goToCanvasSwitchRealtime(versionID, diagramID));
};

export const goToDiagramCommenting = (diagramID: string, threadID?: string): Thunk => async (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  await switchRealtime(dispatch, getState, versionID, diagramID);
  dispatch(goToCanvasCommenting(versionID, diagramID, Query.stringify({ thread: threadID })));
};

export const goToCurrentPrototype = (nodeID?: string): SyncThunk => (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  dispatch(goToPrototype(versionID, nodeID));
};

export const goToCurrentSettings = (): SyncThunk => (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  dispatch(goToSettings(versionID));
};

export const goToActivePlatformPublish = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = activePlatformSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPublish(versionID, platform));
};

export const goToCurrentCanvasInteractionModel = (entityType: InteractionModelTabType): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  if (!versionID || !diagramID) return;

  dispatch(goTo(generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType: entityType })));
};

export const goToCurrentCanvasInteractionModelEntity = (entityType: InteractionModelTabType, entityID: string): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goTo(generatePath(Path.CANVAS_MODEL_ENTITY, { versionID, diagramID, modelType: entityType, modelEntityID: entityID })));
};

export const goToCurrentWorkspaceSettings = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const workspaceID = activeWorkspaceIDSelector(state)!;
  dispatch(goToWorkspaceSettings(workspaceID));
};
