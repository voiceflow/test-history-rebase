import { Struct } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { generatePath } from 'react-router';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { CMSRoute, Path } from '@/config/routes';
import { PageProgressBar } from '@/constants';
import * as Creator from '@/ducks/creatorV2';
import * as Designer from '@/ducks/designer';
import * as DomainSelectors from '@/ducks/domain/selectors';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/versionV2';
import { SyncThunk } from '@/store/types';

import {
  goTo,
  goToAnalytics,
  goToCanvasCommenting,
  goToCanvasCommentingThread,
  goToCanvasTextMarkup,
  goToConversations,
  goToDialogManagerAPI,
  goToDomainCanvasCommenting,
  goToDomainCanvasCommentingThread,
  goToDomainCanvasTextMarkup,
  goToPath,
  goToPlatformPrototype,
  goToPrototype,
  goToPublish,
  goToSettings,
  goToTranscript,
  goToWorkspace,
  goToWorkspaceMembers,
  goToWorkspaceSettings,
  redirectTo,
  redirectToCanvasCommentingThread,
  redirectToDomainCanvasCommentingThread,
  redirectToPath,
} from './actions';

export const goToVersions = (versionID: string) => goTo(`${generatePath(Path.PROJECT_SETTINGS_VERSION, { versionID })}`);

export const goToBackups = (versionID: string) => goTo(`${generatePath(Path.PROJECT_SETTINGS_BACKUP, { versionID })}`);

interface GoToProjectCanvasOptions {
  state?: Struct;
  subpath?: string;
  versionID: string;
  diagramID?: string;
  pageProgress?: boolean;
}

export const goToProjectCanvas = ({ state, subpath, diagramID, versionID }: GoToProjectCanvasOptions) =>
  goToPath(Path.PROJECT_CANVAS, { state, params: { diagramID, versionID }, search: window.location.search, subpath });

export const redirectToProjectCanvas = ({ state, subpath, diagramID, versionID }: GoToProjectCanvasOptions) =>
  redirectToPath(Path.PROJECT_CANVAS, { state, params: { diagramID, versionID }, search: window.location.search, subpath });

export const goToCanvasNode = ({ state, nodeID, subpath, diagramID, versionID }: GoToProjectCanvasOptions & { nodeID: string; diagramID: string }) =>
  goToPath(Path.CANVAS_NODE, { state, params: { versionID, diagramID, nodeID }, search: window.location.search, subpath });

export const goToCanvasDiagram =
  ({
    state,
    nodeID,
    subpath,
    diagramID,
    versionID,
    pageProgress = true,
  }: GoToProjectCanvasOptions & { nodeID?: string; diagramID: string }): SyncThunk =>
  (dispatch, getState) => {
    const activeDiagramID = Creator.activeDiagramIDSelector(getState());

    if (pageProgress && diagramID !== activeDiagramID) {
      PageProgress.start(PageProgressBar.CANVAS_LOADING);
    }

    if (nodeID) {
      dispatch(goToCanvasNode({ state, nodeID, subpath, diagramID, versionID }));
    } else {
      dispatch(goToProjectCanvas({ state, subpath, diagramID, versionID }));
    }
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
interface GoToDomainOptions {
  domainID?: string;
  versionID: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToDomain = ({ domainID, versionID }: GoToDomainOptions) =>
  goTo(`${generatePath(Path.PROJECT_DOMAIN, { domainID, versionID })}${window.location.search}`);

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const redirectToDomain = ({ domainID, versionID }: GoToDomainOptions) =>
  redirectTo(`${generatePath(Path.PROJECT_DOMAIN, { versionID, domainID })}${window.location.search}`);

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
interface GoToDomainCanvasOptions extends GoToDomainOptions {
  domainID: string;
  diagramID?: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
interface GoToDomainCanvasDiagramOptions extends GoToDomainCanvasOptions {
  diagramID: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToDomainCanvas = ({ domainID, diagramID, versionID }: GoToDomainCanvasOptions) =>
  goTo(`${generatePath(Path.DOMAIN_CANVAS, { domainID, diagramID, versionID })}${window.location.search}`);

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const redirectToDomainCanvas = ({ domainID, diagramID, versionID, extraPath = '' }: GoToDomainCanvasOptions & { extraPath?: string }) =>
  redirectTo(`${generatePath(Path.DOMAIN_CANVAS, { versionID, diagramID, domainID })}${extraPath}${window.location.search}`);

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
interface GoToDomainCanvasNodeOptions extends GoToDomainCanvasDiagramOptions {
  nodeID: string;
  routeState?: Struct;
  nodeSubPath?: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToDomainCanvasNode = ({ nodeID, domainID, versionID, diagramID, routeState, nodeSubPath }: GoToDomainCanvasNodeOptions) =>
  goTo(
    `${generatePath(Path.DOMAIN_CANVAS_NODE, { versionID, diagramID, domainID, nodeID })}${nodeSubPath ? `/${nodeSubPath.replace(/^\//, '')}` : ''}${
      window.location.search
    }`,
    routeState
  );

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
interface GoToCanvasSwitchRealtimeOptions extends GoToDomainCanvasDiagramOptions {
  nodeID?: string;
}

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToCanvasSwitchRealtime =
  ({ nodeID, domainID, versionID, diagramID }: GoToCanvasSwitchRealtimeOptions): SyncThunk =>
  (dispatch) => {
    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (nodeID) {
      dispatch(goToDomainCanvasNode({ nodeID, domainID, diagramID, versionID }));
    } else {
      dispatch(goToDomainCanvas({ domainID, diagramID, versionID }));
    }
  };

export const goToCurrentCanvas = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
    const rootDiagramID = Version.active.rootDiagramIDSelector(state);

    Errors.assertDiagramID(diagramID ?? rootDiagramID);

    dispatch(goToProjectCanvas({ versionID, diagramID: diagramID ?? rootDiagramID ?? undefined }));

    return;
  }

  const domainID = Session.activeDomainIDSelector(state);
  const rootDomain = DomainSelectors.rootDomainSelector(state);

  if (domainID && diagramID) {
    dispatch(goToDomainCanvas({ domainID, diagramID, versionID }));
    return;
  }

  if (!rootDomain) throw Errors.noActiveDomainID();

  dispatch(goToDomainCanvas({ domainID: rootDomain.id, diagramID: rootDomain.rootDiagramID, versionID }));
};

export const goToCurrentCanvasCommenting =
  (threadID?: string, commentID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      if (threadID) {
        dispatch(goToCanvasCommentingThread({ diagramID, versionID, threadID, commentID }));
      } else {
        dispatch(goToCanvasCommenting({ diagramID, versionID }));
      }

      return;
    }

    const domainID = Session.activeDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    if (threadID) {
      dispatch(goToDomainCanvasCommentingThread({ domainID, diagramID, versionID, threadID, commentID }));
    } else {
      dispatch(goToDomainCanvasCommenting({ domainID, diagramID, versionID }));
    }
  };

export const goToCurrentCanvasTextMarkup = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
    dispatch(goToCanvasTextMarkup({ diagramID, versionID }));

    return;
  }

  const domainID = Session.activeDomainIDSelector(state);

  Errors.assertDomainID(domainID);

  dispatch(goToDomainCanvasTextMarkup({ domainID, diagramID, versionID }));
};

export const redirectToCurrentCanvasCommentingThread =
  (threadID: string, commentID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      dispatch(redirectToCanvasCommentingThread({ diagramID, versionID, threadID, commentID }));

      return;
    }

    const domainID = Session.activeDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    dispatch(redirectToDomainCanvasCommentingThread({ domainID, diagramID, versionID, threadID, commentID }));
  };

export const goToCanvasRootDiagram = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Version.active.rootDiagramIDSelector(state);

  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvasDiagram({ diagramID, versionID, pageProgress: !Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS) }));
};

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToDomainRootDiagram = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const domainID = Session.activeDomainIDSelector(state);
  const versionID = Session.activeVersionIDSelector(state);
  const rootDiagramID = DomainSelectors.active.rootDiagramIDSelector(state);

  Errors.assertDomainID(domainID);
  Errors.assertVersionID(versionID);

  if (!rootDiagramID) throw new Error('no active root diagram ID');

  dispatch(goToCanvasSwitchRealtime({ diagramID: rootDiagramID, domainID, versionID }));
};

export const goToRootDiagramIfActive =
  (diagramID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Creator.activeDiagramIDSelector(state);

    if (diagramID !== activeDiagramID) return;

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      dispatch(goToCanvasRootDiagram());
    } else {
      dispatch(goToDomainRootDiagram());
    }
  };

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToRootDomain = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const rootDomain = DomainSelectors.rootDomainSelector(state);

  Errors.assertDomainID(rootDomain?.id);
  Errors.assertVersionID(versionID);

  dispatch(goToCanvasSwitchRealtime({ diagramID: rootDomain.rootDiagramID, domainID: rootDomain.id, versionID }));
};

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const goToDomainDiagram =
  (domainID: string, diagramID: string, nodeID?: string): SyncThunk =>
  (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    dispatch(goToCanvasSwitchRealtime({ nodeID, domainID, diagramID, versionID }));
  };

export const goToDiagram =
  (diagramID: string, nodeID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      const versionID = Session.activeVersionIDSelector(getState());

      Errors.assertVersionID(versionID);

      dispatch(Creator.clearFocus());
      dispatch(goToCanvasDiagram({ nodeID, diagramID, versionID, pageProgress: false }));

      return;
    }

    const domainID =
      DomainSelectors.domainIDByTopicIDSelector(state, { topicID: diagramID }) ??
      Session.activeDomainIDSelector(state) ??
      DomainSelectors.rootDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    dispatch(goToDomainDiagram(domainID, diagramID, nodeID));
  };

export const goToDiagramHistoryPush =
  (diagramID: string, nodeID?: string, activeNodeID?: string): SyncThunk =>
  (dispatch, getState) => {
    const activeDiagramID = Session.activeDiagramIDSelector(getState());

    Errors.assertDiagramID(activeDiagramID);

    dispatch(goToDiagram(diagramID, nodeID));

    dispatch(Creator.diagramsHistoryPush(activeDiagramID, activeNodeID));
  };

export const goToDiagramHistoryPop = (): SyncThunk => (dispatch, getState) => {
  const { diagramID, nodeID } = Creator.previousDiagramHistoryStateSelector(getState()) || {};

  Errors.assertDiagramID(diagramID);

  dispatch(goToDiagram(diagramID, nodeID));

  dispatch(Creator.diagramsHistoryPop());
};

export const goToDiagramHistoryClear =
  (diagramID: string, nodeID?: string): SyncThunk =>
  (dispatch) => {
    dispatch(goToDiagram(diagramID, nodeID));

    dispatch(Creator.diagramsHistoryClear());
  };

export const goToDiagramCommenting =
  (diagramID: string, threadID?: string, commentID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      if (threadID) {
        dispatch(goToCanvasCommentingThread({ versionID, diagramID, threadID, commentID }));
      } else {
        dispatch(goToCanvasCommenting({ versionID, diagramID }));
      }

      return;
    }

    const domainID = DomainSelectors.domainIDByTopicIDSelector(state, { topicID: diagramID }) ?? DomainSelectors.rootDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (threadID) {
      dispatch(goToDomainCanvasCommentingThread({ domainID, versionID, diagramID, threadID, commentID }));
    } else {
      dispatch(goToDomainCanvasCommenting({ domainID, versionID, diagramID }));
    }
  };

export const goToCurrentPrototype =
  (nodeID?: string): SyncThunk =>
  (dispatch, getState) => {
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

export const goToActivePlatformPublish = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPublish(versionID, platform));
};

export const goToActiveDialogManagerAPI = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToDialogManagerAPI(versionID));
};

export const goToActivePlatformPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToPlatformPrototype(versionID, platform));
};

export const goToConversationsPage = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);
  dispatch(goToConversations(versionID));
};

export const goToCurrentCanvasNode =
  (nodeID: string, { state: routeState, subpath }: { state?: Struct; subpath?: string }): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    if (Feature.isFeatureEnabledSelector(state)(Realtime.FeatureFlag.CMS_WORKFLOWS)) {
      dispatch(goToCanvasNode({ versionID, diagramID, nodeID, state: routeState, subpath }));

      return;
    }

    const domainID = Session.activeDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    dispatch(goToDomainCanvasNode({ domainID, versionID, diagramID, nodeID, nodeSubPath: subpath, routeState }));
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

export const goToTargetTranscript =
  (transcriptID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    Errors.assertVersionID(versionID);

    dispatch(goToTranscript(versionID, transcriptID));
  };

export const goToCMSResource =
  (resourceType: CMSRoute, resourceID?: string, routeState?: Struct): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    if (!resourceID) {
      dispatch(goTo(generatePath(Path.CMS_RESOURCE, { versionID, resourceType }), routeState));
      return;
    }

    const resourceSelector = Designer.utils.getCMSResourceOneByIDSelector(resourceType);

    const resource = resourceSelector(state, { id: resourceID });
    const folderIDs = Designer.Folder.selectors.idsChainByLeafFolderID(state, { folderID: resource?.folderID ?? null });

    const folderPaths = folderIDs.map((id) => `folder/${id}`).join('/');

    if (folderPaths) {
      dispatch(goTo(generatePath(`${Path.CMS_RESOURCE}/${folderPaths}/${resourceID}`, { versionID, resourceType }), routeState));
    } else {
      dispatch(goTo(generatePath(Path.CMS_RESOURCE_ACTIVE, { versionID, resourceID, resourceType }), routeState));
    }
  };
