import { History } from 'history';
import * as Redux from 'redux';
import { persistStore } from 'redux-persist';

import { IS_DEVELOPMENT } from '@/config';
import createReducer from '@/ducks';
import createMiddleware from '@/store/middleware';

import { Store } from './types';

declare global {
  interface Window {
    store: Store;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

function createStore(history: History) {
  const middleware = createMiddleware(history);
  const store: Store = Redux.createStore(createReducer(history), {}, composeEnhancers(Redux.applyMiddleware(...middleware)));
  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && module.hot) {
    module.hot.accept('@/ducks', () => store.replaceReducer(createReducer(history)));
  }

  window.store = store;

  return { store, persistor };
}

export default createStore;
