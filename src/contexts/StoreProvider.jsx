import React from 'react';
import * as ReactRedux from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import rootReducer from '@/ducks/_root';
import createMiddleware from '@/store/middleware';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// eslint-disable-next-line react/display-name
const StoreProvider = ({ history, children }) => {
  const middleware = createMiddleware(history);
  const store = createStore(rootReducer(history), {}, composeEnhancers(applyMiddleware(...middleware)));
  const persistor = persistStore(store);

  window.store = store;

  return (
    <ReactRedux.Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </ReactRedux.Provider>
  );
};

export default StoreProvider;
