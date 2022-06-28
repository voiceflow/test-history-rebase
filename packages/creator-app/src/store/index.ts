import { Client } from '@logux/client';
import { History } from 'history';
import { Persistor, persistStore } from 'redux-persist';

import { IS_DEVELOPMENT } from '@/config';
import createReducer, { allRPCs } from '@/ducks';

import createMiddleware from './middleware';
import { RPCController } from './rpc';
import { Store } from './types';
import { createEnhancedStore } from './utils';

declare global {
  interface Window {
    store: Store;
  }
}

const createStore = (realtime: Client, history: History): { store: Store; persistor: Persistor } => {
  const rootReducer = createReducer(history);
  const rpcController = new RPCController();

  const store = createEnhancedStore(
    rootReducer,
    createMiddleware(history, rpcController.createMiddleware(allRPCs), () => store),
    realtime
  );

  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && import.meta.hot) {
    import.meta.hot.accept('@/ducks', () => {
      store.replaceReducer(createReducer(history));
      rpcController.replaceHandlers(allRPCs);
    });
  }

  window.store = store;

  return { store, persistor };
};

export default createStore;
