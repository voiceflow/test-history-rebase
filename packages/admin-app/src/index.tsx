import './client/socket';
// Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-day-picker/lib/style.css';
import './Admin.css';

import { ToastContainer } from '@voiceflow/ui';
import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@/vendors/sentry';

import GlobalProviders from './contexts/GlobalProviders';
import AllRoutes from './Routes/allRoutes';

Sentry.init();

// Render ReactDOM
ReactDOM.render(
  <GlobalProviders>
    <AllRoutes />
    <ToastContainer />
  </GlobalProviders>,
  document.getElementById('root')
);
