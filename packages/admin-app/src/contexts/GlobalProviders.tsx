import { ConnectedRouter } from 'connected-react-router';
import React from 'react';

import StoreProvider, { history } from '@/store';

import LifecycleProvider from './LifecycleProvider';
import ThemeProvider from './ThemeProvider';

const GlobalProviders: React.FC = ({ children }) => (
  <StoreProvider>
    <ConnectedRouter history={history}>
      <LifecycleProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LifecycleProvider>
    </ConnectedRouter>
  </StoreProvider>
);

export default GlobalProviders;
