import * as Realtime from '@voiceflow/realtime-sdk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Action, ActionCreator, AnyAction, isType } from 'typescript-fsa';

import { DEBUG_REALTIME } from '@/config';
import * as Account from '@/ducks/account/selectors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { Middleware, MiddlewareAPI } from '@/store/types';

import { hideCursorCoords, setCursorCoords } from '../observables';

const createActionTypeMap = (actionsCreators: ActionCreator<any>[]): Record<string, true> =>
  actionsCreators.reduce<Record<string, true>>((acc, action) => Object.assign(acc, { [action.type]: true }), {});

const CreatorLevelActionsMap = createActionTypeMap([...Object.values(Realtime.workspace.crudLocalActions)]);

const WorkspaceLevelActionsMap = createActionTypeMap([
  ...Object.values(Realtime.workspace.crudActions),
  ...Object.values(Realtime.projectList.crudActions),
  Realtime.projectList.transplantProjectBetweenLists,
]);

const ProjectLevelActionsMap = createActionTypeMap([
  ...Object.values(Realtime.project.crudActions),
  Realtime.project.awarenessLoadViewers,
  Realtime.project.awarenessUpdateViewers,
]);

const DiagramLevelActionsMap = createActionTypeMap([
  Realtime.diagram.awarenessMoveCursor,
  Realtime.diagram.awarenessHideCursor,
  Realtime.diagram.addBlocks,
  Realtime.diagram.removeBlocks,
  Realtime.diagram.moveBlocks,
  Realtime.diagram.dragBlocks,
]);

const isCreatorLevelAction = (action: AnyAction): action is Action<Realtime.BaseCreatorPayload> => action.type in CreatorLevelActionsMap;

const isWorkspaceLevelAction = (action: AnyAction): action is Action<Realtime.BaseWorkspacePayload> => action.type in WorkspaceLevelActionsMap;

const isProjectLevelAction = (action: AnyAction): action is Action<Realtime.BaseProjectPayload> => action.type in ProjectLevelActionsMap;

const isDiagramLevelAction = (action: AnyAction): action is Action<Realtime.BaseDiagramPayload> => action.type in DiagramLevelActionsMap;

const isAtomicActionsEnabled = (api: MiddlewareAPI) => Feature.isFeatureEnabledSelector(api.getState());

export const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator - Realtime Store',
  actionsBlacklist: DEBUG_REALTIME ? [] : ['logux/state', Realtime.diagram.awarenessMoveCursor.type],
});

export const createIgnoreMiddleware =
  (shouldIgnore: (api: MiddlewareAPI, action: any) => boolean): Middleware =>
  (api) =>
  (next) =>
  (action) => {
    if (shouldIgnore(api, action)) {
      return;
    }

    next(action);
  };

const isActiveWorkspaceAction = (api: MiddlewareAPI, action: Action<Realtime.BaseWorkspacePayload>) =>
  action.payload.workspaceID === Session.activeWorkspaceIDSelector(api.getState());

const isActiveProjectAction = (api: MiddlewareAPI, action: Action<Realtime.BaseProjectPayload>) =>
  isActiveWorkspaceAction(api, action) && action.payload.projectID === Session.activeProjectIDSelector(api.getState());

const isActiveDiagramAction = (api: MiddlewareAPI, action: Action<Realtime.BaseDiagramPayload>) =>
  isActiveProjectAction(api, action) && action.payload.diagramID === Session.activeDiagramIDSelector(api.getState());

/**
 * ignore all unregistered actions and actions form different project/diagram/workspace
 */

export const unregisteredActionsIgnoreMiddleware = createIgnoreMiddleware(
  (api, action) =>
    !(
      isCreatorLevelAction(action) ||
      (isWorkspaceLevelAction(action) && isActiveWorkspaceAction(api, action)) ||
      (isProjectLevelAction(action) && isActiveProjectAction(api, action)) ||
      (isDiagramLevelAction(action) && isActiveDiagramAction(api, action))
    )
);

/**
 * ignore actions from own cursor movements
 */
export const ownCursorIgnoreMiddleware: Middleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.awarenessMoveCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  return action.payload.creatorID === creatorID;
});

/**
 * capture volatile cursor movement events
 * ignores actions from own cursor movements
 */
export const moveCursorMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isAtomicActionsEnabled(api)) return false;

  if (!isType(action, Realtime.diagram.awarenessMoveCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  if (action.payload.creatorID === creatorID) return true;

  setCursorCoords(action.payload);

  return true;
});

/**
 * capture hide cursor events to pipe to observable
 * ignores actions from own cursor movements
 */
export const hideCursorMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isAtomicActionsEnabled(api)) return false;

  if (!isType(action, Realtime.diagram.awarenessHideCursor)) return false;

  const creatorID = Account.userIDSelector(api.getState());

  if (action.payload.creatorID === creatorID) return true;

  hideCursorCoords(action.payload);

  return true;
});

// export default [unregisteredActionsIgnoreMiddleware, ownCursorIgnoreMiddleware, moveCursorMiddleware, hideCursorMiddleware];
export default [moveCursorMiddleware, hideCursorMiddleware];
