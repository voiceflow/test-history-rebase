// eslint-disable-next-line import/no-extraneous-dependencies
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import throttle from 'lodash/throttle';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { INITIAL_STATE } from '@/admin/store/ducks/adminV2';

import { loadState, saveState } from './persist';
import rootReducer from './rootReducer';

export const history = createBrowserHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const ReduxProvider = ({ children, initialState = {} }) => {
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
        adminV2: {
          ...INITIAL_STATE,
          theme: store.getState().adminV2.theme,
        },
      });
    }, 1000)
  );

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
