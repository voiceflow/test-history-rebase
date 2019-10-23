// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import React from 'react';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import { ToastContainer } from 'react-toastify';

import IntercomChat from '@/components/IntercomChat';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import ErrorModal from '@/components/Modal/ErrorModal';
import Modal from '@/components/Modal/Modal';

import Routes from './Routes';
import Alerts from './components/Alerts/Alerts';
import AccountLoadingGate from './contexts/AccountLoadingGate';
import GlobalProviders from './contexts/GlobalProviders';
import SocketLoadingGate from './contexts/SocketLoadingGate';

const App = ({ history, store, persistor }) => (
  <GlobalProviders history={history} store={store} persistor={persistor}>
    <SocketLoadingGate>
      <AccountLoadingGate>
        {() => (
          <>
            <Helmet>
              <title>Voiceflow Creator</title>
            </Helmet>
            <ConfirmModal />
            <ErrorModal />
            <Modal />
            <Alerts />
            <ToastContainer />
            <Routes />
            <IntercomChat />
          </>
        )}
      </AccountLoadingGate>
    </SocketLoadingGate>
  </GlobalProviders>
);

export default hot(App);
