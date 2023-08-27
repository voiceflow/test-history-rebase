import { datadogLogs } from '@datadog/browser-logs';
import { Client } from '@logux/client';
import { composeWithDevTools } from '@redux-devtools/extension';
import * as Realtime from '@voiceflow/realtime-sdk';
import { History } from 'history';
import * as Redux from 'redux';
import { Persistor, persistStore } from 'redux-persist';

import { DEBUG_REALTIME, IS_DEVELOPMENT } from '@/config';
import createReducer, { allRPCs } from '@/ducks';

import { ACTION_INVALIDATORS, ACTION_REVERTERS } from './constants';
import { createStoreCreator } from './create-store-creator';
import createMiddleware from './middleware';
import logger from './redux-logger';
import { RPCController } from './rpc';
import { Store } from './types';
import { rewriteDispatch } from './utils';

declare global {
  interface Window {
    store: Store;
  }
}

const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator',
  actionsDenylist: DEBUG_REALTIME
    ? []
    : [
        'logux/state',
        'logux/processed',
        Realtime.project.awareness.updateDiagramViewers.type,
        Realtime.diagram.awareness.heartbeat.type,
        Realtime.diagram.awareness.updateLockedEntities.type,
      ],
});

const createStore = (realtime: Client, history: History): { store: Store; persistor: Persistor } => {
  const reducerOptions = {
    browserHistory: history,
    reverters: ACTION_REVERTERS,
    invalidators: ACTION_INVALIDATORS,
    getClientNodeID: () => realtime.nodeId,
  };
  const rootReducer = createReducer(reducerOptions);
  const createStore = createStoreCreator(realtime);
  const rpcController = new RPCController();

  const store = createStore(
    rootReducer,
    undefined,
    composeEnhancers(Redux.applyMiddleware(...createMiddleware(history, rpcController.createMiddleware(allRPCs), () => store), logger))
  ) as Store;

  store.dispatch = rewriteDispatch(store);

  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && import.meta.hot) {
    import.meta.hot.accept('@/ducks', () => {
      store.replaceReducer(createReducer(reducerOptions));
      rpcController.replaceHandlers(allRPCs);
    });
  }

  window.store = store;

  return { store, persistor };
};

export default createStore;
