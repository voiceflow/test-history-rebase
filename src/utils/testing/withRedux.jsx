import { createMemoryHistory } from 'history';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import rootReducer from '@/ducks/_root';
import createMiddleware from '@/store/middleware';

export const ReduxProvider = ({ state = {}, children }) => {
  const history = createMemoryHistory();
  const middleware = createMiddleware(history);
  const store = createStore(rootReducer(history), state, compose(applyMiddleware(...middleware)));

  return <ReactRedux.Provider store={store}>{children}</ReactRedux.Provider>;
};

// eslint-disable-next-line react/display-name
export default (state = {}) => (Component) => (props) => (
  <ReduxProvider state={state}>
    <Component {...props} />
  </ReduxProvider>
);
