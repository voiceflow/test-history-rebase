import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
// eslint-disable-next-line you-dont-need-lodash-underscore/throttle
import _throttle from 'lodash/throttle';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import { INITIAL_STATE } from '@/ducks/adminV2';

import rootReducer from '../ducks';
import { loadState, saveState } from './persist';

export const history = createBrowserHistory();
// eslint-disable-next-line no-underscore-dangle
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
    _throttle(() => {
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
