import { History } from 'history';
import * as Redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore } from 'redux-persist';

import { IS_DEVELOPMENT } from '@/config';
import createReducer from '@/ducks';
import createMiddleware from '@/store/middleware';

import { Store } from './types';

declare global {
  interface Window {
    store: Store;
  }
}

export const composeEnhancers = composeWithDevTools({ name: 'Voiceflow Creator - Global Store' });

function createStore(history: History) {
  const middleware = createMiddleware(history);
  const store = Redux.createStore(createReducer(history), {}, composeEnhancers(Redux.applyMiddleware(...middleware))) as Store;
  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && module.hot) {
    module.hot.accept('@/ducks', () => store.replaceReducer(createReducer(history)));
  }

  window.store = store;

  return { store, persistor };
}

export default createStore;
