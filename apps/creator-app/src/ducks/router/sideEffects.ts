import { Struct } from '@voiceflow/common';
import { generatePath } from 'react-router-dom';

import { PageProgress } from '@/components/PageProgressBar/utils';
import * as Errors from '@/config/errors';
import { CMSRoute, Path } from '@/config/routes';
import { PageProgressBar } from '@/constants';
import * as Creator from '@/ducks/creatorV2';
import * as Designer from '@/ducks/designer';
import * as DomainSelectors from '@/ducks/domain/selectors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';

import {
  goTo,
  goToAnalytics,
  goToCanvasCommenting,
  goToCanvasCommentingThread,
  goToCanvasTextMarkup,
  goToConversations,
  goToDialogManagerAPI,
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
} from './actions';

export const goToVersions = (versionID: string) => goTo(`${generatePath(Path.PROJECT_VERSION_SETTINGS, { versionID })}`);

export const goToBackups = (versionID: string) => goTo(`${generatePath(Path.PROJECT_BACKUP_SETTINGS, { versionID })}`);

interface GoToDomainOptions {
  domainID?: string;
  versionID: string;
}

export const goToDomain = ({ domainID, versionID }: GoToDomainOptions) =>
  goTo(`${generatePath(Path.PROJECT_DOMAIN, { domainID, versionID })}${window.location.search}`);

export const redirectToDomain = ({ domainID, versionID }: GoToDomainOptions) =>
  redirectTo(`${generatePath(Path.PROJECT_DOMAIN, { versionID, domainID })}${window.location.search}`);

interface GoToCanvasOptions extends GoToDomainOptions {
  domainID: string;
  diagramID?: string;
}

interface GoToCanvasDiagramOptions extends GoToCanvasOptions {
  diagramID: string;
}

export const goToCanvas = ({ domainID, diagramID, versionID }: GoToCanvasOptions) =>
  goTo(`${generatePath(Path.DOMAIN_CANVAS, { domainID, diagramID, versionID })}${window.location.search}`);

export const redirectToCanvas = ({ domainID, diagramID, versionID, extraPath = '' }: GoToCanvasOptions & { extraPath?: string }) =>
  redirectTo(`${generatePath(Path.DOMAIN_CANVAS, { versionID, diagramID, domainID })}${extraPath}${window.location.search}`);

interface GoToCanvasNodeOptions extends GoToCanvasDiagramOptions {
  nodeID: string;
  routeState?: Struct;
  nodeSubPath?: string;
}

const STARTING_SLASH_REGEX = /^\//;

export const goToCanvasNode = ({ nodeID, domainID, versionID, diagramID, routeState, nodeSubPath }: GoToCanvasNodeOptions) =>
  goTo(
    `${generatePath(Path.CANVAS_NODE, { versionID, diagramID, domainID, nodeID })}${
      nodeSubPath ? `/${nodeSubPath.replace(STARTING_SLASH_REGEX, '')}` : ''
    }${window.location.search}`,
    routeState
  );

interface GoToCanvasSwitchRealtimeOptions extends GoToCanvasDiagramOptions {
  nodeID?: string;
}

export const goToCanvasSwitchRealtime =
  ({ nodeID, domainID, versionID, diagramID }: GoToCanvasSwitchRealtimeOptions): SyncThunk =>
  (dispatch) => {
    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (nodeID) {
      dispatch(goToCanvasNode({ nodeID, domainID, diagramID, versionID }));
    } else {
      dispatch(goToCanvas({ domainID, diagramID, versionID }));
    }
  };

export const goToCurrentCanvas = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const domainID = Session.activeDomainIDSelector(state);
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);
  const rootDomain = DomainSelectors.rootDomainSelector(state);

  Errors.assertVersionID(versionID);

  if (domainID && diagramID) {
    dispatch(goToCanvas({ domainID, diagramID, versionID }));
    return;
  }

  if (!rootDomain) throw Errors.noActiveDomainID();

  dispatch(goToCanvas({ domainID: rootDomain.id, diagramID: rootDomain.rootDiagramID, versionID }));
};

export const goToCurrentCanvasCommenting =
  (threadID?: string, commentID?: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const domainID = Session.activeDomainIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertDomainID(domainID);
    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    if (threadID) {
      dispatch(goToCanvasCommentingThread({ domainID, diagramID, versionID, threadID, commentID }));
    } else {
      dispatch(goToCanvasCommenting({ domainID, diagramID, versionID }));
    }
  };

export const goToCurrentCanvasTextMarkup = (): SyncThunk => (dispatch, getState) => {
  const state = getState();

  const domainID = Session.activeDomainIDSelector(state);
  const versionID = Session.activeVersionIDSelector(state);
  const diagramID = Session.activeDiagramIDSelector(state);

  Errors.assertDomainID(domainID);
  Errors.assertVersionID(versionID);
  Errors.assertDiagramID(diagramID);

  dispatch(goToCanvasTextMarkup({ domainID, diagramID, versionID }));
};

export const redirectToCurrentCanvasCommentingThread =
  (threadID: string, commentID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const domainID = Session.activeDomainIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertDomainID(domainID);
    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(redirectToCanvasCommentingThread({ domainID, diagramID, versionID, threadID, commentID }));
  };

export const goToDomainRootDiagram = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  const domainID = Session.activeDomainIDSelector(state);
  const versionID = Session.activeVersionIDSelector(state);
  const rootDiagramID = DomainSelectors.active.rootDiagramIDSelector(state);

  Errors.assertDomainID(domainID);
  Errors.assertVersionID(versionID);

  if (!rootDiagramID) throw new Error('no active root diagram ID');

  await dispatch(goToCanvasSwitchRealtime({ diagramID: rootDiagramID, domainID, versionID }));
};

export const goToRootDiagramIfActive =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeDiagramID = Creator.activeDiagramIDSelector(state);

    if (diagramID === activeDiagramID) {
      await dispatch(goToDomainRootDiagram());
    }
  };

export const goToRootDomain = (): Thunk => async (dispatch, getState) => {
  const state = getState();

  const versionID = Session.activeVersionIDSelector(state);
  const rootDomain = DomainSelectors.rootDomainSelector(state);

  Errors.assertDomainID(rootDomain?.id);
  Errors.assertVersionID(versionID);

  await dispatch(goToCanvasSwitchRealtime({ diagramID: rootDomain.rootDiagramID, domainID: rootDomain.id, versionID }));
};

export const redirectToDiagram =
  (domainID: string, diagramID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    dispatch(redirectToCanvas({ domainID, versionID, diagramID }));
  };

export const goToDomainDiagram =
  (domainID: string, diagramID: string, nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const versionID = Session.activeVersionIDSelector(getState());

    Errors.assertVersionID(versionID);

    await dispatch(goToCanvasSwitchRealtime({ nodeID, domainID, diagramID, versionID }));
  };

export const goToDiagram =
  (diagramID: string, nodeID?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const domainID =
      DomainSelectors.domainIDByTopicIDSelector(state, { topicID: diagramID }) ??
      Session.activeDomainIDSelector(state) ??
      DomainSelectors.rootDomainIDSelector(state);

    Errors.assertDomainID(domainID);

    await dispatch(goToDomainDiagram(domainID, diagramID, nodeID));
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

    const domainID = DomainSelectors.domainIDByTopicIDSelector(state, { topicID: diagramID }) ?? DomainSelectors.rootDomainIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertDomainID(domainID);
    Errors.assertVersionID(versionID);

    PageProgress.start(PageProgressBar.CANVAS_LOADING);

    if (threadID) {
      dispatch(goToCanvasCommentingThread({ domainID, versionID, diagramID, threadID, commentID }));
    } else {
      dispatch(goToCanvasCommenting({ domainID, versionID, diagramID }));
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

export const goToActiveDialogManagerAPI = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(goToDialogManagerAPI(versionID));
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

export const goToCurrentCanvasNode =
  (nodeID: string, nodeSubPath?: string, routeState?: Struct): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const domainID = Session.activeDomainIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertDomainID(domainID);
    Errors.assertVersionID(versionID);
    Errors.assertDiagramID(diagramID);

    dispatch(goToCanvasNode({ domainID, versionID, diagramID, nodeID, nodeSubPath, routeState }));
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
