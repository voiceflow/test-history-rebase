import { generatePath } from 'react-router-dom';

import * as Errors from '@/config/errors';
import { Path } from '@/config/routes';
import { InteractionModelTabType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { activeRootDiagramIDSelector, activeVersionSelector } from '@/ducks/version/selectors';
import { SyncThunk, Thunk } from '@/store/types';
import * as Query from '@/utils/query';

import {
  goTo,
  goToCanvasCommenting,
  goToConversations,
  goToPrototype,
  goToPublish,
  goToSettings,
  goToTranscript,
  goToWorkspaceSettings,
  pushSearch,
  redirectTo,
  redirectToCanvasCommenting,
} from './actions';

export const goToCanvas = (versionID: string, diagramID?: string) =>
  goTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const redirectToCanvas = (versionID: string, diagramID?: string) =>
  redirectTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const goToCanvasSwitchRealtime =
  (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk =>
  async (dispatch) => {
    await dispatch(Realtime.switchRealtimeDiagram(versionID, diagramID, isNewDiagram));

    dispatch(goToCanvas(versionID, diagramID));
  };

export const redirectToCanvasSwitchRealtime =
  (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk =>
  async (dispatch) => {
    await dispatch(Realtime.switchRealtimeDiagram(versionID, diagramID, isNewDiagram));

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
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const rootDiagramID = activeRootDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  if (!rootDiagramID) throw new Error('no active root diagram ID');

  await dispatch(goToCanvasSwitchRealtime(versionID, rootDiagramID));
};

export const redirectToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const version = activeVersionSelector(getState());

  if (!version) throw Errors.noActiveVersionID();

  await dispatch(redirectToCanvasSwitchRealtime(version.id, version.rootDiagramID));
};

export const goToDiagram =
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    if (nodeID) {
      dispatch(pushSearch(`?nodeID=${nodeID}`));
    }

    await dispatch(goToCanvasSwitchRealtime(versionID, diagramID));
  };

export const goToDiagramHistoryPush =
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch) => {
    await dispatch(goToDiagram(diagramID, nodeID));

    dispatch(Creator.diagramsHistoryPush(diagramID));
  };

export const goToDiagramHistoryPop =
  (diagramID: string): Thunk =>
  async (dispatch) => {
    await dispatch(goToDiagram(diagramID));

    dispatch(Creator.diagramsHistoryPop());
  };

export const goToDiagramHistoryClear =
  (diagramID: string): Thunk =>
  async (dispatch) => {
    await dispatch(goToDiagram(diagramID));

    dispatch(Creator.diagramsHistoryClear());
  };

export const goToDiagramCommenting =
  (diagramID: string, threadID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    await dispatch(Realtime.switchRealtimeDiagram(versionID, diagramID));
    dispatch(goToCanvasCommenting(versionID, diagramID, Query.stringify({ thread: threadID })));
  };

export const goToCurrentPrototype =
  (nodeID?: string): SyncThunk =>
  (dispatch, getState) => {
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
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  Errors.assertVersionID(versionID);

  dispatch(goToPublish(versionID, platform));
};

export const goToConversationsPage = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);
  dispatch(goToConversations(versionID));
};

export const goToCurrentCanvasInteractionModel =
  (entityType: InteractionModelTabType): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    if (!versionID || !diagramID) return;

    dispatch(goTo(generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType: entityType })));
  };

export const goToCurrentCanvasInteractionModelEntity =
  (entityType: InteractionModelTabType, entityID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(goTo(generatePath(Path.CANVAS_MODEL_ENTITY, { versionID, diagramID, modelType: entityType, modelEntityID: entityID })));
  };

export const goToCurrentWorkspaceSettings = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const workspaceID = Session.activeWorkspaceIDSelector(state);

  Errors.assertWorkspaceID(workspaceID);

  dispatch(goToWorkspaceSettings(workspaceID));
};

export const goToCurrentTranscript = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  Errors.assertVersionID(versionID);

  dispatch(goToTranscript(versionID));
};

export const goToTargetTranscript =
  (transcriptID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    Errors.assertVersionID(versionID);

    dispatch(goToTranscript(versionID, transcriptID));
  };
