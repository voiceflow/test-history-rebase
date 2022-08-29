import { Struct } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { CALL_HISTORY_METHOD, push, replace } from 'connected-react-router';
import { generatePath } from 'react-router-dom';

import { Path, PublishRoute } from '@/config/routes';
import { Action } from '@/store/types';
import * as Query from '@/utils/query';
import { isDialogflowPlatform } from '@/utils/typeGuards';

export type RouterAction = Action<typeof CALL_HISTORY_METHOD, unknown>;

export const clearSearch = () => replace({ search: '' }) as RouterAction;

export const pushSearch = (search: string) => push({ search }) as RouterAction;

export const goTo = <T extends Struct>(path: string, state: T | null = null) => push(path.startsWith('/') ? path : `/${path}`, state) as RouterAction;

export const redirectTo = <T extends Struct>(path: string, state: T | null = null) =>
  replace(path.startsWith('/') ? path : `/${path}`, state) as RouterAction;

export const goToHome = () => goTo('');

export const goToLogin = (search?: string) => goTo(`${Path.LOGIN}${search ?? ''}`);

export const goToLogout = (search?: string) => goTo(`${Path.LOGOUT}${search ?? ''}`);

export const goToSignup = (search?: string) => goTo(`${Path.SIGNUP}${search ?? ''}`);

export const goToAdoptSSO = (state: { domain: string; clientID: string; email: string }) => goTo(Path.SSO_ADOPT, state);

export const goToWorkspace = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));

export const goToWorkspaceWithSearch = (workspaceID: string, search: string) =>
  goTo(`${generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })}${search}`);

export const goToNewWorkspace = () => goTo(Path.NEW_WORKSPACE);

export const goToWorkspaceSettings = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_SETTINGS, { workspaceID }));

export const goToWorkspaceDeveloperSettings = (workspaceID: string, search?: string) =>
  goTo(`${generatePath(Path.WORKSPACE_DEVELOPER_SETTINGS, { workspaceID })}${search || ''}`);

export const goToDashboard = () => goTo(Path.DASHBOARD);

export const goToDashboardWithSearch = (search?: string) => goTo(`${Path.DASHBOARD}${search ?? ''}`);

export const goToOnboarding = (search?: string) => goTo(`${Path.ONBOARDING}${search || window.location.search}`);

export const goToPrototype = (versionID: string, nodeID?: string) =>
  goTo(`${generatePath(Path.PROJECT_PROTOTYPE, { versionID })}${nodeID ? Query.stringify({ nodeID }) : ''}`);

export const goToSettings = (versionID: string) => goTo(generatePath(Path.PROJECT_SETTINGS, { versionID }));

export const goToPublish = (versionID: string, platform: VoiceflowConstants.PlatformType) => {
  let platformPath: string = platform;

  if (isDialogflowPlatform(platform)) {
    platformPath = PublishRoute.DIALOGFLOW;
  }

  return goTo(`${generatePath(Path.PROJECT_PUBLISH, { versionID })}${platform ? `/${platformPath}` : ''}`);
};

export const goToConversations = (versionID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.CONVERSATIONS, { versionID })}${search}`);

export const goToProducts = (versionID: string) => goTo(generatePath(Path.PRODUCT_LIST, { versionID }));

export const goToNewProduct = (versionID: string) => goTo(generatePath(Path.NEW_PRODUCT, { versionID }));

export const goToTranscript = (versionID: string, transcriptID?: string, search = window.location.search) =>
  goTo(`${generatePath(Path.CONVERSATIONS, { versionID, transcriptID })}${search}`);

export const goToNLUManager = (versionID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.NLU_MANAGER, { versionID })}${search}`);

export const goToEditProduct = (versionID: string, productID: string) => goTo(generatePath(Path.PRODUCT_DETAILS, { versionID, productID }));

export const goToInteractionModel = (versionID: string, diagramID: string, modelType?: string, entityID?: string) =>
  goTo(`${generatePath(Path.CANVAS_MODEL, { versionID, diagramID, modelType, entityID })}`);

export const goToCanvasTextMarkup = (versionID: string, diagramID: string) => goTo(generatePath(Path.CANVAS_TEXT_MARKUP, { versionID, diagramID }));

export const goToCanvasCommenting = (versionID: string, diagramID: string) =>
  goTo(`${generatePath(Path.CANVAS_COMMENTING, { versionID, diagramID })}`);

export const goToCanvasCommentingThread = (versionID: string, diagramID: string, threadID: string, commentID?: string) =>
  goTo(generatePath(Path.CANVAS_COMMENTING_THREAD, { versionID, diagramID, threadID, commentID }));

export const redirectToCanvasCommentingThread = (versionID: string, diagramID: string, threadID: string, commentID?: string) =>
  redirectTo(generatePath(Path.CANVAS_COMMENTING_THREAD, { versionID, diagramID, threadID, commentID }));

export const redirectToDashboard = () => redirectTo(Path.DASHBOARD);

export const redirectToWorkspace = (workspaceID: string) => redirectTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));
