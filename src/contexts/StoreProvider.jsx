import React from 'react';
import * as ReactRedux from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// eslint-disable-next-line react/display-name
const StoreProvider = ({ store, persistor, children }) => (
  <ReactRedux.Provider store={store}>
    <PersistGate persistor={persistor}>{children}</PersistGate>
  </ReactRedux.Provider>
);

export default StoreProvider;
