// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import './assets/fontawesome/css/all.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import React from 'react';
import { Helmet } from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';

import IntercomChat from '@/components/IntercomChat';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import ErrorModal from '@/components/Modal/ErrorModal';
import Modal from '@/components/Modal/Modal';
import ModalBackdrop from '@/components/Modal/ModalBackdrop';
import SuccessModal from '@/components/Modal/SuccessModal';
import BatchLoadingGate from '@/componentsV2/BatchLoadingGate';
import { ToastContainer } from '@/componentsV2/Toast';
import CollaboratorsModal from '@/containers/Collaborators/CollaboratorsModal';
import BillingModal from '@/containers/Payment/BillingModal';
import PaymentModal from '@/containers/Payment/PaymentModal';
import { AccountLoadingGate, SocketLoadingGate } from '@/gates';

import Routes from './Routes';
import Alerts from './components/Alerts/Alerts';
import GlobalProviders from './contexts/GlobalProviders';

const App = ({ history, store, persistor }) => (
  <GlobalProviders history={history} store={store} persistor={persistor}>
    <BatchLoadingGate gates={[SocketLoadingGate, AccountLoadingGate]}>
      {() => (
        <>
          <Helmet>
            <title>Voiceflow Creator</title>
          </Helmet>
          <SuccessModal />
          <ConfirmModal />
          <ErrorModal />
          <ModalBackdrop />
          <Modal />
          <Alerts />
          <ToastContainer />
          <Routes />
          <IntercomChat />
          <CollaboratorsModal />
          <BillingModal />
          <PaymentModal />
        </>
      )}
    </BatchLoadingGate>
  </GlobalProviders>
);

export default hot(App);
