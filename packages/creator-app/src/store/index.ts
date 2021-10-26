import { Client } from '@logux/client';
import { createStoreCreator } from '@logux/redux';
import * as Realtime from '@voiceflow/realtime-sdk';
import { History } from 'history';
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Persistor, persistStore } from 'redux-persist';

import { DEBUG_REALTIME, IS_DEVELOPMENT } from '@/config';
import createReducer, { allRPCs } from '@/ducks';

import createMiddleware from './middleware';
import { RPCController } from './rpc';
import { Dispatchable, Store } from './types';

declare global {
  interface Window {
    store: Store;
  }
}

export const composeEnhancers = composeWithDevTools({
  name: 'Voiceflow Creator',
  actionsBlacklist: DEBUG_REALTIME ? [] : ['logux/state', Realtime.diagram.awareness.moveCursor.type],
});

const createStore = (realtime: Client, history: History): { store: Store; persistor: Persistor } => {
  const rootReducer = createReducer(history);
  const createStore = createStoreCreator(realtime);
  const rpcController = new RPCController();

  const store = createStore(
    rootReducer,
    undefined,
    composeEnhancers(Redux.applyMiddleware(...createMiddleware(history, rpcController.createMiddleware(allRPCs), () => store)))
  ) as Store;

  // thunk
  const originalDispatch = store.dispatch;
  // Object.assign is used to copy sync/crossTab/etc methods from the original dispatch method
  store.dispatch = Object.assign((action: Dispatchable) => {
    if (typeof action === 'function') {
      return action(store.dispatch, store.getState, { log: store.log });
    }
    originalDispatch(action);
    return action;
  }, originalDispatch);

  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && module.hot) {
    module.hot.accept('@/ducks', () => {
      store.replaceReducer(createReducer(history));
      rpcController.replaceHandlers(allRPCs);
    });
  }

  window.store = store;

  return { store, persistor };
};

export default createStore;
