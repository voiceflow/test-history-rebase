import { routerMiddleware } from 'connected-react-router';
import rootReducer from 'ducks/_root';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// eslint-disable-next-line react/display-name
export default ({ children, initialState = {} }) => {
  const store = createStore(rootReducer(history), initialState, composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)));
  return <Provider store={store}>{children}</Provider>;
};
