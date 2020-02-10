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
import { ConfirmModal, ErrorModal, ModalBackdrop, SuccessModal } from '@/components/Modal';
import Modal from '@/components/Modal/Modal';
import BatchLoadingGate from '@/componentsV2/BatchLoadingGate';
import { ToastContainer } from '@/componentsV2/Toast';
import { AccountLoadingGate, GlobalSocketSubscriptionsLoadingGate, SocketLoadingGate } from '@/gates';
import CollaboratorsModal from '@/pages/Collaborators/CollaboratorsModal';
import BillingModal from '@/pages/Payment/BillingModal';
import PaymentModal from '@/pages/Payment/PaymentModal';

import Routes from './Routes';
import Alerts from './components/Alerts/Alerts';
import GlobalProviders from './contexts/GlobalProviders';

const App = ({ history, store, persistor }) => (
  <GlobalProviders history={history} store={store} persistor={persistor}>
    <BatchLoadingGate gates={[SocketLoadingGate, AccountLoadingGate, GlobalSocketSubscriptionsLoadingGate]}>
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
