import { CrossTabClient } from '@logux/client';
import { createStoreCreator } from '@logux/redux';
import { LoguxDispatch } from '@logux/redux/create-store-creator';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Action, ActionCreator, AnyAction, isType } from 'typescript-fsa';

import { DEBUG_REALTIME } from '@/config';
import { RealtimeStore } from '@/contexts/RealtimeStoreContext';
import type { State } from '@/ducks';
import { userIDSelector } from '@/ducks/account/selectors';
import realtimeReducer, { RealtimeState } from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';

let realtimeStore: RealtimeStore;

interface LoguxMiddlewareAPI extends Redux.MiddlewareAPI<LoguxDispatch<AnyAction>, RealtimeState> {
  global: Redux.Store<State>;
}

interface LoguxMiddleware {
  (api: LoguxMiddlewareAPI): (next: Redux.Dispatch<AnyAction>) => (action: any) => any;
}

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

export const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator - Realtime Store',
  actionsBlacklist: DEBUG_REALTIME ? [] : ['logux/state', Realtime.diagram.awarenessMoveCursor.type],
});

export const createIgnoreMiddleware =
  (shouldIgnore: (api: LoguxMiddlewareAPI, action: any) => boolean): LoguxMiddleware =>
  (api) =>
  (next) =>
  (action) => {
    if (shouldIgnore(api, action)) {
      return;
    }

    next(action);
  };

const isActiveWorkspaceAction = (api: LoguxMiddlewareAPI, action: Action<Realtime.BaseWorkspacePayload>) =>
  action.payload.workspaceID === Session.activeWorkspaceIDSelector(api.global.getState());

const isActiveProjectAction = (api: LoguxMiddlewareAPI, action: Action<Realtime.BaseProjectPayload>) =>
  isActiveWorkspaceAction(api, action) && action.payload.projectID === Session.activeProjectIDSelector(api.global.getState());

const isActiveDiagramAction = (api: LoguxMiddlewareAPI, action: Action<Realtime.BaseDiagramPayload>) =>
  isActiveProjectAction(api, action) && action.payload.diagramID === Session.activeDiagramIDSelector(api.global.getState());

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
export const ownCursorIgnoreMiddleware: LoguxMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.awarenessMoveCursor)) return false;

  const creatorID = userIDSelector(api.global.getState());

  return action.payload.creatorID === creatorID;
});

export const wrapDispatch = (getStore: () => RealtimeStore) =>
  Object.assign((action: AnyAction) => getStore().dispatch(action), {
    local: (action: AnyAction) => getStore().dispatch.local(action),
    sync: (action: AnyAction) => getStore().dispatch.sync(action),
    crossTab: (action: AnyAction) => getStore().dispatch.crossTab(action),
  }) as LoguxDispatch<AnyAction>;

const createRealtimeStore = (globalStore: Redux.Store<State>, realtime: CrossTabClient): RealtimeStore => {
  const createStore = createStoreCreator(realtime);

  const store: RealtimeStore = createStore(
    realtimeReducer,
    undefined,
    composeEnhancers(
      Redux.applyMiddleware(
        ...[unregisteredActionsIgnoreMiddleware, ownCursorIgnoreMiddleware].map(
          (middleware) => (api: Redux.MiddlewareAPI<LoguxDispatch<AnyAction>, RealtimeState>) =>
            middleware({
              ...api,
              global: globalStore,
              dispatch: wrapDispatch(() => store),
            })
        )
      )
    )
  );

  realtimeStore = store;

  return store;
};

export const getRealtimeStore = (): RealtimeStore => realtimeStore;

export default createRealtimeStore;
