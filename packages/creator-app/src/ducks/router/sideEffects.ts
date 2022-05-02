import { generatePath } from 'react-router-dom';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import { InteractionModelTabType, PageProgressBar } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as VariableState from '@/ducks/variableState';
import * as VersionV2 from '@/ducks/versionV2';
import { SyncThunk, Thunk } from '@/store/types';

import {
  goTo,
  goToCanvasCommenting,
  goToCanvasCommentingThread,
  goToConversations,
  goToPrototype,
  goToPublish,
  goToSettings,
  goToTranscript,
  goToWorkspaceSettings,
  pushSearch,
  redirectTo,
  redirectToCanvasCommentingThread,
} from './actions';

export const goToCanvas = (versionID: string, diagramID?: string) =>
  goTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const goToVersions = (versionID: string) => goTo(`${generatePath(Path.PROJECT_VERSION_SETTINGS, { versionID })}`);

export const redirectToCanvas = (versionID: string, diagramID?: string) =>
  redirectTo(`${generatePath(Path.PROJECT_CANVAS, { versionID, diagramID })}${window.location.search}`);

export const goToCanvasSwitchRealtime =
  (versionID: string, diagramID: string, isNewDiagram?: boolean): Thunk =>
  async (dispatch) => {
    PageProgress.start(PageProgressBar.CANVAS_LOADING);

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
  const version = VersionV2.active.versionSelector(state);

  Errors.assertVersionID(versionID);

  if (diagramID) {
    dispatch(goToCanvas(versionID, diagramID));
    return;
  }

  if (!version) throw Errors.noActiveVersionID();

  dispatch(goToCanvas(versionID, version.rootDiagramID));
};

export const goToCurrentCanvasCommenting =
  (threadID?: string, commentID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    if (threadID) {
      dispatch(goToCanvasCommentingThread(versionID, diagramID, threadID, commentID));
    } else {
      dispatch(goToCanvasCommenting(versionID, diagramID));
    }
  };

export const redirectToCurrentCanvasCommentingThread =
  (threadID: string, commentID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(redirectToCanvasCommentingThread(versionID, diagramID, threadID, commentID));
  };

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  if (!rootDiagramID) throw new Error('no active root diagram ID');

  await dispatch(goToCanvasSwitchRealtime(versionID, rootDiagramID));
};

export const redirectToDiagram =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const version = VersionV2.active.versionSelector(getState());

    if (!version) throw Errors.noActiveVersionID();

    PageProgress.start(PageProgressBar.CANVAS_LOADING);
    await dispatch(redirectToCanvasSwitchRealtime(version.id, diagramID));
  };

export const goToDiagram =
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    if (nodeID) {
      await dispatch(pushSearch(`?nodeID=${nodeID}`));
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
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch) => {
    await dispatch(goToDiagram(diagramID, nodeID));

    dispatch(Creator.diagramsHistoryClear());
  };

export const goToDiagramCommenting =
  (diagramID: string, threadID?: string, commentID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    await dispatch(Realtime.switchRealtimeDiagram(versionID, diagramID));

    if (threadID) {
      dispatch(goToCanvasCommentingThread(versionID, diagramID, threadID, commentID));
    } else {
      dispatch(goToCanvasCommenting(versionID, diagramID));
    }
  };

export const goToCurrentPrototype =
  (nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const topics = VersionV2.active.topicsSelector(state);
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);
    const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);
    const isTopicsAndComponentsEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.TOPICS_AND_COMPONENTS);
    const isTopicsAndComponentsVersion = ProjectV2.active.isTopicsAndComponentsVersionSelector(state);
    const isVariableStatesEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.VARIABLE_STATES);
    const variableStatesStartFromDiagramID = VariableState.selectedStartFromDiagramIDSelector(state);

    Errors.assertVersionID(versionID);

    const isTopic = topics.find((item) => item.sourceID === diagramID);

    if (isVariableStatesEnabled && variableStatesStartFromDiagramID) {
      await dispatch(redirectToDiagram(variableStatesStartFromDiagramID));
    } else if (!nodeID && isTopic && rootDiagramID && rootDiagramID !== diagramID && isTopicsAndComponentsEnabled && isTopicsAndComponentsVersion) {
      await dispatch(redirectToDiagram(rootDiagramID));
    }

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

    dispatch(
      goTo(
        generatePath(Path.CANVAS_MODEL_ENTITY, {
          versionID,
          diagramID,
          modelType: entityType,
          modelEntityID: encodeURIComponent(entityID),
        })
      )
    );
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
