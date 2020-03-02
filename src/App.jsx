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
import { ConfirmModal, ErrorModal, ModalBackdrop, SuccessModal } from '@/components/LegacyModal';
import Modal from '@/components/LegacyModal/Modal';
import { ToastContainer } from '@/components/Toast';
import { AccountLoadingGate, GlobalSocketSubscriptionsLoadingGate, SocketLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useSessionTracking } from '@/hooks';
import CollaboratorsModal from '@/pages/Collaborators/CollaboratorsModal';
import BillingModal from '@/pages/Payment/BillingModal';
import PaymentModal from '@/pages/Payment/PaymentModal';
import { compose } from '@/utils/functional';

import Routes from './Routes';
import { withGlobalProviders } from './contexts/GlobalProviders';

const App = () => {
  useSessionTracking();

  return (
    <>
      <Helmet>
        <title>Voiceflow Creator</title>
      </Helmet>
      <SuccessModal />
      <ConfirmModal />
      <ErrorModal />
      <ModalBackdrop />
      <Modal />
      <ToastContainer />
      <Routes />
      <IntercomChat />
      <CollaboratorsModal />
      <BillingModal />
      <PaymentModal />
    </>
  );
};

export default compose(
  hot,
  withGlobalProviders,
  withBatchLoadingGate(SocketLoadingGate, AccountLoadingGate, GlobalSocketSubscriptionsLoadingGate)
)(App);
