import { createMemoryHistory } from 'history';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import rootReducer from '@/ducks/_root';
import createMiddleware from '@/store/middleware';

export default () => (Component) => {
  const history = createMemoryHistory();
  const middleware = createMiddleware(history);
  const store = createStore(rootReducer(history), {}, compose(applyMiddleware(...middleware)));

  // eslint-disable-next-line react/display-name
  return (props) => (
    <ReactRedux.Provider store={store}>
      <Component {...props} />
    </ReactRedux.Provider>
  );
};
