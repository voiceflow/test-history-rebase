import { Client } from '@logux/client';
import { ChannelErrors, ClientContext } from '@logux/client/react';
import React from 'react';
import * as ReactRedux from 'react-redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { Store } from '@/store/types';

export interface StoreProviderProps {
  logux: Client;
  store: Store;
  children: React.ReactNode;
  persistor: Persistor;
}

/**
 * redux store provider with builtin rehydrating
 * from localStorage, sessionStorage and cookies
 */
const StoreProvider: React.FC<StoreProviderProps> = ({ logux, store, persistor, children }) => (
  <ClientContext.Provider value={logux}>
    {/* TODO: move into the page instead to avoid appearing above important UI elements */}
    <ChannelErrors>
      <ReactRedux.Provider store={store}>
        <PersistGate persistor={persistor}>{children}</PersistGate>
      </ReactRedux.Provider>
    </ChannelErrors>
  </ClientContext.Provider>
);

export default StoreProvider;
