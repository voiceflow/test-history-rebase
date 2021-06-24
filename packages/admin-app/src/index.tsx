import './client/socket';
// Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import './Admin.css';

import { ToastContainer } from '@voiceflow/ui';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@/vendors/sentry';

import LifecycleProvider from './contexts/LifecycleProvider';
import AllRoutes from './Routes/allRoutes';
import Root, { history } from './store';

Sentry.init();

// Render ReactDOM
ReactDOM.render(
  <Root>
    <ConnectedRouter history={history}>
      <LifecycleProvider>
        <AllRoutes />
        <ToastContainer />
      </LifecycleProvider>
    </ConnectedRouter>
  </Root>,
  document.getElementById('root')
);
