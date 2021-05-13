import { createMemoryHistory } from 'history';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import rootReducer from '@/ducks';
import createMiddleware from '@/store/middleware';

export const ReduxProvider = ({ state = {}, history = createMemoryHistory(), children }) => {
  const middleware = createMiddleware(history);
  const store = createStore(rootReducer(history), state, compose(applyMiddleware(...middleware)));

  return <ReactRedux.Provider store={store}>{children}</ReactRedux.Provider>;
};

export default (state = {}) => (Component) => (props) => (
  <ReduxProvider state={state}>
    <Component {...props} />
  </ReduxProvider>
);
