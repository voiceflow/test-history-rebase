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
import { toast } from 'react-toastify';

import AllRoutes from './Routes/allRoutes';
import Root, { history } from './store';

toast.configure({
  autoClose: 1000,
  draggable: false,
  pauseOnFocusLoss: false,
});

// Render ReactDOM
ReactDOM.render(
  <Root>
    <ConnectedRouter history={history}>
      <AllRoutes />
    </ConnectedRouter>
  </Root>,
  document.getElementById('root')
);
