import React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { Store } from '@/store/types';

export interface StoreProviderProps {
  store: Store;
  persistor: Persistor;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ store, persistor, children }) => (
  <ReactRedux.Provider store={store as Redux.Store}>
    <PersistGate persistor={persistor}>{children}</PersistGate>
  </ReactRedux.Provider>
);

export default StoreProvider;
