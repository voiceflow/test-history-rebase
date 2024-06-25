import type { Client } from '@logux/client';
import { ClientContext } from '@logux/client/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import type { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { StoreAtomProvider } from '@/components/StoreAtomProvider.component';
import type { Store } from '@/store/types';

export interface StoreProviderProps extends React.PropsWithChildren {
  store: Store;
  realtime: Client;
  persistor: Persistor;
}

/**
 * redux store provider with builtin rehydrating
 * from localStorage, sessionStorage and cookies
 */
const StoreProvider: React.FC<StoreProviderProps> = ({ store, realtime, persistor, children }) => (
  <ClientContext.Provider value={realtime}>
    <ReactRedux.Provider store={store}>
      <PersistGate persistor={persistor}>
        <StoreAtomProvider />
        {children}
      </PersistGate>
    </ReactRedux.Provider>
  </ClientContext.Provider>
);

export default StoreProvider;
