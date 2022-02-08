import React from 'react';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';

import { history, store } from '@/store';

import LifecycleProvider from './LifecycleProvider';
import ThemeProvider from './ThemeProvider';

const GlobalProviders: React.FC = ({ children }) => (
  <Provider store={store}>
    <HistoryRouter history={history}>
      <LifecycleProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LifecycleProvider>
    </HistoryRouter>
  </Provider>
);

export default GlobalProviders;
