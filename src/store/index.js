import * as Redux from 'redux';
import { persistStore } from 'redux-persist';

import { IS_DEVELOPMENT } from '@/config';
import createReducer from '@/ducks/_root';
import createMiddleware from '@/store/middleware';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;

function createStore(history) {
  const middleware = createMiddleware(history);
  const store = Redux.createStore(createReducer(history), {}, composeEnhancers(Redux.applyMiddleware(...middleware)));
  const persistor = persistStore(store);

  if (IS_DEVELOPMENT && module.hot) {
    module.hot.accept('@/ducks/_root', () => store.replaceReducer(createReducer(history)));
  }

  window.store = store;

  return { store, persistor };
}

export default createStore;
