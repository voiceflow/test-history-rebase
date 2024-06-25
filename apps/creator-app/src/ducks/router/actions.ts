import type { Struct } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import type { CALL_HISTORY_METHOD } from 'connected-react-router';
import { push, replace } from 'connected-react-router';
import type { ExtractRouteParams } from 'react-router';
import { generatePath } from 'react-router-dom';

import { Path, PublishRoute, RootRoute } from '@/config/routes';
import type { Action } from '@/store/types';
import * as Query from '@/utils/query';
import { isDialogflowPlatform } from '@/utils/typeGuards';

export type RouterAction = Action<typeof CALL_HISTORY_METHOD, unknown>;

interface ToPathOptions<T extends string> {
  state?: Struct;
  params: ExtractRouteParams<T>;
  search?: string;
  subpath?: string;
}

const normalizePath = (path: string, { isSubpath }: { isSubpath?: boolean } = {}) =>
  (isSubpath && !path) || path.startsWith('/') ? path : `/${path}`;

export const clearSearch = () => replace({ search: '' }) as RouterAction;

export const pushSearch = (search: string) => push({ search }) as RouterAction;

export const goTo = <T extends Struct>(path: string, state: T | null = null) =>
  push(normalizePath(path), state) as RouterAction;

export const redirectTo = <T extends Struct>(path: string, state: T | null = null) =>
  replace(normalizePath(path), state) as RouterAction;

export const goToPath = <T extends string>(path: T, { search, state, params, subpath = '' }: ToPathOptions<T>) =>
  push({
    state,
    search,
    pathname: `${generatePath(normalizePath(path), params)}${normalizePath(subpath, { isSubpath: true })}`,
  });

export const redirectToPath = <T extends string>(path: T, { search, state, params, subpath = '' }: ToPathOptions<T>) =>
  replace({
    state,
    search,
    pathname: `${generatePath(normalizePath(path), params)}${normalizePath(subpath, { isSubpath: true })}`,
  });

export const goToHome = () => goTo('');

export const goToLogin = <T extends Struct>(search?: string, state?: T | null) =>
  goTo(`${Path.LOGIN}${search ?? ''}`, state);

export const goToAccount = (search?: string) => goTo(`${Path.ACCOUNT}${search ?? ''}`);

export const goToAccountV2 = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_PROFILE, { workspaceID }));

export const goToLogout = (search?: string) => goTo(`${Path.LOGOUT}${search ?? ''}`);

export const goToSignup = (search?: string) => goTo(`${Path.SIGNUP}${search ?? ''}`);

export const goToWorkspace = (workspaceID: string) => goTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));

export const goToWorkspaceWithSearch = (workspaceID: string, search: string) =>
  goTo(`${generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID })}${search}`);

export const goToWorkspaceMembers = (workspaceID: string) =>
  goTo(generatePath(Path.WORKSPACE_MEMBERS, { workspaceID }));

export const goToWorkspaceSettings = (workspaceID: string) =>
  goTo(generatePath(Path.WORKSPACE_SETTINGS, { workspaceID }));

export const goToDashboard = () => goTo(Path.DASHBOARD);

export const redirectToDashboard = () => redirectTo(Path.DASHBOARD);

export const redirectToWorkspace = (workspaceID: string) =>
  redirectTo(generatePath(Path.WORKSPACE_DASHBOARD, { workspaceID }));

export const goToDashboardWithSearch = (search?: string) => goTo(`${Path.DASHBOARD}${search ?? ''}`);

export const goToOnboarding = (search?: string) => goTo(`${Path.ONBOARDING}${search || window.location.search}`);

export const goToPrototype = (versionID: string, nodeID?: string) =>
  goTo(`${generatePath(Path.PROJECT_PROTOTYPE, { versionID })}${Query.stringify({ nodeID })}`);

export const goToSettings = <T extends Struct>(versionID: string, { state }: { state?: T } = {}) =>
  goTo(generatePath(Path.PROJECT_SETTINGS, { versionID }), state);

export const goToAnalytics = (versionID: string) => goTo(generatePath(Path.PROJECT_ANALYTICS, { versionID }));

export const goToPublish = (versionID: string, platform: Platform.Constants.PlatformType) => {
  let platformPath: string = platform;

  if (isDialogflowPlatform(platform)) {
    platformPath = PublishRoute.DIALOGFLOW;
  }

  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return goTo(`${generatePath(Path.PROJECT_PUBLISH, { versionID })}${platform ? `/${platformPath}` : ''}`);
};

export const goToDialogManagerAPI = (versionID: string) => {
  return goTo(generatePath(Path.PUBLISH_API, { versionID }));
};

export const goToCMSWorkflow = (versionID: string) => goTo(`${generatePath(Path.CMS_WORKFLOW, { versionID })}`);
export const goToCMSKnowledgeBase = (versionID: string) => goTo(generatePath(Path.CMS_KNOWLEDGE_BASE, { versionID }));

export const goToPlatformPrototype = (versionID: string, platform: Platform.Constants.PlatformType) =>
  goTo(generatePath(`${Path.PROJECT_PUBLISH}/prototype/${platform}`, { versionID }));

export const goToConversations = (versionID: string, search = window.location.search) =>
  goTo(`${generatePath(Path.PROJECT_CONVERSATIONS, { versionID })}${search}`);

export const goToTranscript = (versionID: string, transcriptID?: string, search = window.location.search) =>
  goTo(`${generatePath(Path.PROJECT_CONVERSATIONS, { versionID, transcriptID })}${search}`);

export const goToCanvasWithVersionID = (versionID: string) =>
  goTo(`${RootRoute.PROJECT}/${versionID}/${RootRoute.CANVAS}`);

interface GoToCanvasBaseOptions {
  diagramID: string;
  versionID: string;
}

export const goToCanvasTextMarkup = (options: GoToCanvasBaseOptions) =>
  goTo(generatePath(Path.CANVAS_TEXT_MARKUP, options));

export const goToCanvasCommenting = (options: GoToCanvasBaseOptions) =>
  goTo(`${generatePath(Path.CANVAS_COMMENTING, options)}`);

interface GoToCanvasCommentingThreadOptions extends GoToCanvasBaseOptions {
  threadID: string;
  commentID?: string;
}

export const goToCanvasCommentingThread = (options: GoToCanvasCommentingThreadOptions) =>
  goTo(generatePath(Path.CANVAS_COMMENTING_THREAD, options));

export const redirectToCanvasCommentingThread = (options: GoToCanvasCommentingThreadOptions) =>
  redirectTo(generatePath(Path.CANVAS_COMMENTING_THREAD, options));
