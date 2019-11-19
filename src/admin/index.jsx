import './Socket';
// Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/fontawesome/css/all.min.css';
import 'react-day-picker/lib/style.css';
import './Admin.css';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import { ToastContainer } from '@/componentsV2/Toast';

import AllRoutes from './Routes/allRoutes';
import Root, { history } from './store';

// Render ReactDOM
ReactDOM.render(
  <Root>
    <ConnectedRouter history={history}>
      <AllRoutes />
      <ToastContainer />
    </ConnectedRouter>
  </Root>,
  document.getElementById('root')
);
