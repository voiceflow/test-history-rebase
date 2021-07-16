import { CrossTabClient } from '@logux/client';
import { createStoreCreator, LoguxReduxStore } from '@logux/redux';
import { LoguxDispatch } from '@logux/redux/create-store-creator';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Action, AnyAction, isType } from 'typescript-fsa';

import { DEBUG_REALTIME } from '@/config';
import * as Account from '@/ducks/account';
import realtimeReducer from '@/ducks/realtimeV2';
import * as Session from '@/ducks/session';

interface LoguxMiddlewareAPI<S = any> extends Redux.MiddlewareAPI<LoguxDispatch<AnyAction>, S> {
  global: Redux.Store;
}

interface LoguxMiddleware<S = any> {
  (api: LoguxMiddlewareAPI<S>): (next: Redux.Dispatch<AnyAction>) => (action: any) => any;
}

const isProjectAction = (action: AnyAction): action is Action<Realtime.ProjectPayload> =>
  [Realtime.project.setName.type, Realtime.project.setImage.type, Realtime.project.setPrivacy.type, Realtime.project.updateViewers].includes(
    action.type
  );

const isDiagramAction = (action: AnyAction): action is Action<Realtime.DiagramPayload> => [Realtime.diagram.moveCursor].includes(action.type);

export const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator - Realtime Store',
  actionsBlacklist: DEBUG_REALTIME ? [] : ['logux/state', Realtime.diagram.moveCursor.type],
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

/**
 * ignore cross-tab actions from different programs
 */
export const projectIgnoreMiddleware = createIgnoreMiddleware(
  (api, action) => isProjectAction(action) && action.payload.projectID !== Session.activeProjectIDSelector(api.global.getState())
);

/**
 * ignore cross-tab actions from different diagrams
 */
export const diagramIgnoreMiddleware = createIgnoreMiddleware(
  (api, action) => isDiagramAction(action) && action.payload.diagramID !== Session.activeDiagramIDSelector(api.global.getState())
);

/**
 * ignore actions from own cursor movements
 */
export const ownCursorIgnoreMiddleware: LoguxMiddleware = createIgnoreMiddleware((api, action) => {
  if (!isType(action, Realtime.diagram.moveCursor)) return false;

  const creatorID = Account.userIDSelector(api.global.getState());

  return action.payload.creatorID === creatorID;
});

export const wrapDispatch = (getStore: () => LoguxReduxStore) =>
  Object.assign((action: AnyAction) => getStore().dispatch(action), {
    local: (action: AnyAction) => getStore().dispatch.local(action),
    sync: (action: AnyAction) => getStore().dispatch.sync(action),
    crossTab: (action: AnyAction) => getStore().dispatch.crossTab(action),
  }) as LoguxDispatch<AnyAction>;

const createRealtimeStore = (globalStore: Redux.Store, realtime: CrossTabClient) => {
  const createStore = createStoreCreator(realtime);

  const store: LoguxReduxStore = createStore(
    realtimeReducer,
    undefined,
    composeEnhancers(
      Redux.applyMiddleware(
        ...[projectIgnoreMiddleware, diagramIgnoreMiddleware, ownCursorIgnoreMiddleware].map(
          (middleware) =>
            ((api) =>
              middleware({
                ...api,
                global: globalStore,
                dispatch: wrapDispatch(() => store),
              })) as Redux.Middleware
        )
      )
    )
  );

  return store;
};

export default createRealtimeStore;
