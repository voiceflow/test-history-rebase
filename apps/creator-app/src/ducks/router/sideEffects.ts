import { Struct } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { generatePath } from 'react-router-dom';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { NLURoute, Path } from '@/config/routes';
import { InteractionModelTabType, PageProgressBar, VariableType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { localVariablesSelector } from '@/ducks/diagramV2/selectors/active';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import { NLUManagerOpenedOrigin } from '@/ducks/tracking/constants';
import * as VersionV2 from '@/ducks/versionV2';
import { globalVariablesSelector } from '@/ducks/versionV2/selectors/active';
import { SyncThunk, Thunk } from '@/store/types';
import { addVariablePrefix, removeVariablePrefix } from '@/utils/variable';

import {
  goTo,
  goToAnalytics,
  goToCanvasCommenting,
  goToCanvasCommentingThread,
  goToCanvasTextMarkup,
  goToConversations,
  goToKnowledgeBase,
  goToNLUManager,
  goToPlatformPrototype,
  goToPrototype,
  goToPublish,
  goToPublishProjectAPI,
  goToSettings,
  goToTranscript,
  goToWorkspace,
  goToWorkspaceMembers,
  goToWorkspaceSettings,
  redirectTo,
  redirectToCanvasCommentingThread,
} from './actions';

export const goToVersions = (versionID: string) => goTo(`${generatePath(Path.PROJECT_VERSION_SETTINGS, { versionID })}`);

interface GoToCanvasOptions {
  versionID: string;
  diagramID?: string | null;
}

interface GoToCanvasDiagramOptions extends GoToCanvasOptions {
  diagramID: string;
}

export const goToCanvas = ({ diagramID, versionID }: GoToCanvasOptions) =>
  goTo(`${generatePath(Path.PROJECT_CANVAS, { diagramID: diagramID ?? undefined, versionID })}${window.location.search}`);

export const redirectToCanvas = ({ diagramID, versionID, extraPath = '' }: GoToCanvasOptions & { extraPath?: string }) =>
  redirectTo(`${generatePath(Path.PROJECT_CANVAS, { diagramID: diagramID ?? undefined, versionID })}${extraPath}${window.location.search}`);

interface GoToCanvasNodeOptions extends GoToCanvasDiagramOptions {
  nodeID: string;
  routeState?: Struct;
  nodeSubPath?: string;
}

const STARTING_SLASH_REGEX = /^\//;

export const goToCanvasNode = ({ nodeID, versionID, diagramID, routeState, nodeSubPath }: GoToCanvasNodeOptions) =>
  goTo(
    `${generatePath(Path.CANVAS_NODE, { versionID, diagramID, nodeID })}${nodeSubPath ? `/${nodeSubPath.replace(STARTING_SLASH_REGEX, '')}` : ''}${
      window.location.search
    }`,
    routeState
  );

interface GoToCanvasSwitchRealtimeOptions extends GoToCanvasDiagramOptions {
  nodeID?: string;
}

export const goToCanvasSwitchRealtime =
  ({ nodeID, versionID, diagramID }: GoToCanvasSwitchRealtimeOptions): SyncThunk =>
  (dispatch) => {
    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (nodeID) {
      dispatch(goToCanvasNode({ nodeID, diagramID, versionID }));
    } else {
      dispatch(goToCanvas({ diagramID, versionID }));
    }
  };

export const goToCurrentCanvas = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state) ?? VersionV2.active.rootDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvas({ diagramID, versionID }));
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
      dispatch(goToCanvasCommentingThread({ diagramID, versionID, threadID, commentID }));
    } else {
      dispatch(goToCanvasCommenting({ diagramID, versionID }));
    }
  };

export const goToCurrentCanvasTextMarkup = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvasTextMarkup({ diagramID, versionID }));
};

export const redirectToCurrentCanvasCommentingThread =
  (threadID: string, commentID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(redirectToCanvasCommentingThread({ diagramID, versionID, threadID, commentID }));
  };

export const goToRootDiagram = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);

  Errors.assertVersionID(versionID);

  if (!rootDiagramID) throw new Error('no active root diagram ID');

  await dispatch(goToCanvasSwitchRealtime({ diagramID: rootDiagramID, versionID }));
};

export const redirectToDiagram =
  (diagramID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    dispatch(redirectToCanvas({ versionID, diagramID }));
  };

export const goToDiagram =
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    await dispatch(goToCanvasSwitchRealtime({ nodeID, diagramID, versionID }));
  };

export const goToDiagramHistoryPush =
  (diagramID: string, nodeID?: string, activeNodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const activeDiagramID = Session.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    await dispatch(goToDiagram(diagramID, nodeID));

    dispatch(Creator.diagramsHistoryPush(activeDiagramID, activeNodeID));
  };

export const goToDiagramHistoryPop = (): Thunk => async (dispatch, getState) => {
  const { diagramID, nodeID } = Creator.previousDiagramHistoryStateSelector(getState()) || {};

  Errors.assertDiagramID(diagramID);

  await dispatch(goToDiagram(diagramID, nodeID));

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
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (threadID) {
      dispatch(goToCanvasCommentingThread({ versionID, diagramID, threadID, commentID }));
    } else {
      dispatch(goToCanvasCommenting({ versionID, diagramID }));
    }
  };

export const goToCurrentPrototype =
  (nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(goToPrototype(versionID, nodeID));
  };

export const goToCurrentSettings =
  (options?: { state: Struct }): SyncThunk =>
  (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    dispatch(goToSettings(versionID, options));
  };

export const goToCurrentAnalytics = (): SyncThunk => (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  dispatch(goToAnalytics(versionID));
};

export const goToActivePlatformPublish = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPublish(versionID, platform));
};

export const goToActiveProjectAPIPublish = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPublishProjectAPI(versionID));

  dispatch(Tracking.trackProjectAPIPageOpen());
};

export const goToActivePlatformPrototype = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPlatformPrototype(versionID, platform));
};

export const goToConversationsPage = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);
  dispatch(goToConversations(versionID));
};

export const goToNLUQuickView =
  (entityType?: InteractionModelTabType): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(goTo(generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType: entityType })));
  };

export const goToNLUQuickViewEntity =
  (entityType: InteractionModelTabType, entityID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    let modelEntityID = entityID;

    // entity is variable and it's not prefixed with variable type
    if (entityType === InteractionModelTabType.VARIABLES && entityID === removeVariablePrefix(entityID)) {
      const meta = ProjectV2.active.metaSelector(state);
      const localVariables = localVariablesSelector(state);
      const globalVariables = globalVariablesSelector(state);
      const builtInVariables: string[] = Platform.Config.getTypeConfig(meta).project.globalVariables;

      if (localVariables.includes(entityID)) {
        modelEntityID = addVariablePrefix(VariableType.LOCAL, entityID);
      } else if (globalVariables.includes(entityID)) {
        modelEntityID = addVariablePrefix(VariableType.GLOBAL, entityID);
      } else if (builtInVariables.includes(entityID)) {
        modelEntityID = addVariablePrefix(VariableType.BUILT_IN, entityID);
      }
    }

    dispatch(
      goTo(
        generatePath(Path.CANVAS_MODEL_ENTITY, {
          versionID,
          diagramID,
          modelType: entityType,
          modelEntityID: encodeURIComponent(modelEntityID),
        })
      )
    );
  };

export const goToCurrentCanvasNode =
  (nodeID: string, nodeSubPath?: string, routeState?: Struct): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(goToCanvasNode({ versionID, diagramID, nodeID, nodeSubPath, routeState }));
  };

export const goToCurrentNLUManagerTab =
  (tab: NLURoute, itemID?: string | null): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(
      goTo(
        generatePath(Path.NLU_MANAGER_TAB, {
          versionID,
          tab,
          itemID: itemID ? encodeURIComponent(itemID) : undefined,
        })
      )
    );
  };

export const goToCurrentWorkspace = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const workspaceID = Session.activeWorkspaceIDSelector(state);

  Errors.assertWorkspaceID(workspaceID);

  dispatch(goToWorkspace(workspaceID));
};

export const goToCurrentWorkspaceMembers = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const workspaceID = Session.activeWorkspaceIDSelector(state);

  Errors.assertWorkspaceID(workspaceID);

  dispatch(goToWorkspaceMembers(workspaceID));
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

export const goToCurrentKnowledgeBase = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  Errors.assertVersionID(versionID);

  dispatch(goToKnowledgeBase(versionID));
};

export const goToCurrentNLUManager =
  (origin: NLUManagerOpenedOrigin): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    Errors.assertVersionID(versionID);

    dispatch(goToNLUManager(versionID));

    dispatch(Tracking.trackNLUManagerOpened({ origin }));
  };

export const goToTargetTranscript =
  (transcriptID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    Errors.assertVersionID(versionID);

    dispatch(goToTranscript(versionID, transcriptID));
  };
