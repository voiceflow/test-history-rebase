import { routerMiddleware } from 'connected-react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from 'history';
import throttle from 'lodash/throttle';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { ADMIN_INITIAL_STATE } from '@/admin/store/ducks/admin';

import { loadState, saveState } from './persist';
import rootReducer from './rootReducer';

export const history = createBrowserHistory();
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default ({ children, initialState = {} }) => {
  const middleware = [routerMiddleware(history), thunk];

  const persistedState = loadState();
  const fullState = {
    ...initialState,
    ...persistedState,
  };
  const store = createStore(rootReducer(history), fullState, composeEnhancers(applyMiddleware(...middleware)));

  store.subscribe(
    throttle(() => {
      saveState({
        admin: {
          ...ADMIN_INITIAL_STATE,
          theme: store.getState().admin.theme,
        },
      });
    }, 1000)
  );

  return <Provider store={store}>{children}</Provider>;
};
