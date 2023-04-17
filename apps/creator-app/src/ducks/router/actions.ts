import { Struct } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { CALL_HISTORY_METHOD, push, replace } from 'connected-react-router';
import { generatePath } from 'react-router-dom';

import { Path, PublishRoute, RootRoute } from '@/config/routes';
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

export const goToLogin = <T extends Struct>(search?: string, state?: T | null) => goTo(`${Path.LOGIN}${search ?? ''}`, state);

export const goToAccount = (search?: string) => goTo(`${Path.ACCOUNT}${search ?? ''}`);

export const goToAccountV2 = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_PROFILE, { workspaceID }));

export const goToLogout = (search?: string) => goTo(`${Path.LOGOUT}${search ?? ''}`);

export const goToSignup = (search?: string) => goTo(`${Path.SIGNUP}${search ?? ''}`);

export const goToAdoptSSO = (state: { domain: string; clientID: string; email: string }) => goTo(Path.SSO_ADOPT, state);

export const goToWorkspace = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));

export const goToWorkspaceWithSearch = (workspaceID: string, search: string) =>
  goTo(`${generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })}${search}`);

export const goToWorkspaceMembers = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_MEMBERS, { workspaceID }));

export const goToWorkspaceSettings = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_SETTINGS, { workspaceID }));

export const goToWorkspaceDeveloperSettings = (workspaceID: string, search?: string) =>
  goTo(`${generatePath(Path.WORKSPACE_DEVELOPER_SETTINGS, { workspaceID })}${search || ''}`);

export const goToDashboard = () => goTo(Path.DASHBOARD);

export const goToDashboardWithSearch = (search?: string) => goTo(`${Path.DASHBOARD}${search ?? ''}`);

export const goToOnboarding = (search?: string) => goTo(`${Path.ONBOARDING}${search || window.location.search}`);

export const goToPrototype = (versionID: string, nodeID?: string) =>
  goTo(`${generatePath(Path.PROJECT_PROTOTYPE, { versionID })}${Query.stringify({ nodeID })}`);

export const goToSettings = <T extends Struct>(versionID: string, { state }: { state?: T } = {}) =>
  goTo(generatePath(Path.PROJECT_SETTINGS, { versionID }), state);

export const goToAssistantOverview = (versionID: string) => goTo(generatePath(Path.PROJECT_ASSISTANT_OVERVIEW, { versionID }));

export const goToAnalytics = (versionID: string) => goTo(generatePath(Path.PROJECT_ANALYTICS, { versionID }));

export const goToPublish = (versionID: string, platform: Platform.Constants.PlatformType) => {
  let platformPath: string = platform;

  if (isDialogflowPlatform(platform)) {
    platformPath = PublishRoute.DIALOGFLOW;
  }

  return goTo(`${generatePath(Path.PROJECT_PUBLISH, { versionID })}${platform ? `/${platformPath}` : ''}`);
};

export const goToPlatformPrototype = (versionID: string, platform: Platform.Constants.PlatformType) =>
  goTo(`${generatePath(`${Path.PROJECT_PUBLISH}/prototype/${platform}`, { versionID })}`);

export const goToConversations = (versionID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.CONVERSATIONS, { versionID })}${search}`);

export const goToProducts = (versionID: string) => goTo(generatePath(Path.PRODUCT_LIST, { versionID }));

export const goToNewProduct = (versionID: string) => goTo(generatePath(Path.NEW_PRODUCT, { versionID }));

export const goToTranscript = (versionID: string, transcriptID?: string, search = window.location.search) =>
  goTo(`${generatePath(Path.CONVERSATIONS, { versionID, transcriptID })}${search}`);

export const goToNLUManager = (versionID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.NLU_MANAGER, { versionID })}${search}`);

export const goToEditProduct = (versionID: string, productID: string) => goTo(generatePath(Path.PRODUCT_DETAILS, { versionID, productID }));

interface GoToCanvasBaseOptions {
  domainID: string;
  diagramID: string;
  versionID: string;
}

interface GoToInteractionModelOptions extends GoToCanvasBaseOptions {
  entityID?: string;
  modelType?: string;
}

// here and above using {...options} to fix TS interfaces extend issue
export const goToCanvasWithVersionID = (versionID: string) => goTo(`${RootRoute.PROJECT}/${versionID}/${RootRoute.CANVAS}`);

export const goToCanvasTextMarkup = (options: GoToCanvasBaseOptions) => goTo(generatePath(Path.CANVAS_TEXT_MARKUP, { ...options }));

export const goToInteractionModel = (options: GoToInteractionModelOptions) => goTo(`${generatePath(Path.CANVAS_MODEL, { ...options })}`);

export const goToCanvasCommenting = (options: GoToCanvasBaseOptions) => goTo(`${generatePath(Path.CANVAS_COMMENTING, { ...options })}`);

interface GoToCanvasCommentingThreadOptions extends GoToCanvasBaseOptions {
  threadID: string;
  commentID?: string;
}

export const goToCanvasCommentingThread = (options: GoToCanvasCommentingThreadOptions) =>
  goTo(generatePath(Path.CANVAS_COMMENTING_THREAD, { ...options }));

export const redirectToCanvasCommentingThread = (options: GoToCanvasCommentingThreadOptions) =>
  redirectTo(generatePath(Path.CANVAS_COMMENTING_THREAD, { ...options }));

export const redirectToDashboard = () => redirectTo(Path.DASHBOARD);

export const redirectToWorkspace = (workspaceID: string) => redirectTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));
