import { createAction } from '@voiceflow/ui';

import type { Action } from '@/store/types';

export enum SessionAction {
  SET_AUTH_TOKEN = 'SESSION:SET_AUTH_TOKEN',
  SET_ACTIVE_WORKSPACE_ID = 'SESSION:ACTIVE_WORKSPACE_ID:SET',
  SET_ACTIVE_PROJECT_ID = 'SESSION:ACTIVE_PROJECT_ID:SET',
  SET_ACTIVE_VERSION_ID = 'SESSION:ACTIVE_VERSION_ID:SET',
  SET_ACTIVE_DIAGRAM_ID = 'SESSION:ACTIVE_DIAGRAM_ID:SET',
  SET_ACTIVE_DOMAIN_ID = 'SESSION:ACTIVE_DOMAIN_ID:SET',
  SET_PROTOTYPE_SIDEBAR_VISIBLE = 'SESSION:PROTOTYPE_SIDEBAR_VISIBLE:SET',
}

// action types

export type SetAuthToken = Action<SessionAction.SET_AUTH_TOKEN, string | null>;

export type SetActiveWorkspaceID = Action<SessionAction.SET_ACTIVE_WORKSPACE_ID, string | null>;

export type SetActiveProjectID = Action<SessionAction.SET_ACTIVE_PROJECT_ID, string | null>;

export type SetActiveVersionID = Action<SessionAction.SET_ACTIVE_VERSION_ID, string | null>;

export type SetActiveDiagramID = Action<SessionAction.SET_ACTIVE_DIAGRAM_ID, string | null>;

export type SetActiveDomainID = Action<SessionAction.SET_ACTIVE_DOMAIN_ID, string | null>;

export type SetPrototypeSidebarVisible = Action<SessionAction.SET_PROTOTYPE_SIDEBAR_VISIBLE, boolean>;

export type AnySessionAction =
  | SetAuthToken
  | SetActiveWorkspaceID
  | SetActiveProjectID
  | SetActiveVersionID
  | SetActiveDiagramID
  | SetActiveDomainID
  | SetPrototypeSidebarVisible;

// action creators

export const setAuthToken = (token: string | null): SetAuthToken => createAction(SessionAction.SET_AUTH_TOKEN, token);

export const setActiveWorkspaceID = (workspaceID: string | null): SetActiveWorkspaceID =>
  createAction(SessionAction.SET_ACTIVE_WORKSPACE_ID, workspaceID);

export const setActiveProjectID = (projectID: string | null): SetActiveProjectID => createAction(SessionAction.SET_ACTIVE_PROJECT_ID, projectID);

export const setActiveVersionID = (versionID: string | null): SetActiveVersionID => createAction(SessionAction.SET_ACTIVE_VERSION_ID, versionID);

export const setActiveDiagramID = (diagramID: string | null): SetActiveDiagramID => createAction(SessionAction.SET_ACTIVE_DIAGRAM_ID, diagramID);

export const setActiveDomainID = (domainID: string | null): SetActiveDomainID => createAction(SessionAction.SET_ACTIVE_DOMAIN_ID, domainID);

export const setPrototypeSidebarVisible = (isVisible: boolean): SetPrototypeSidebarVisible =>
  createAction(SessionAction.SET_PROTOTYPE_SIDEBAR_VISIBLE, isVisible);
