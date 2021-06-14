// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';

import IntercomChat from '@/components/IntercomChat';
import { ConfirmModal, ErrorModal, ModalBackdrop, SuccessModal } from '@/components/LegacyModal';
import LoadingModal from '@/components/LegacyModal/LoadingModal';
import Modal from '@/components/LegacyModal/Modal';
import RefreshModal from '@/components/RefreshModal';
import SeoHelmet from '@/components/SeoHelmet';
import { ToastContainer } from '@/components/Toast';
import { SeoPage } from '@/constants/seo';
import { AccountLoadingGate, FeatureLoadingGate, GlobalSocketSubscriptionsLoadingGate, SocketLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useSessionTracking } from '@/hooks';
import CollaboratorsModal from '@/pages/Collaborators/CollaboratorsModal';
import TagManagerModal from '@/pages/Conversations/components/TagManagerModal';
import ImportModal from '@/pages/Dashboard/components/ImportModal';
import {
  CanvasExportModal,
  ImportBulkDeniedModal,
  ProjectDownloadModal,
  ProjectLimitModal,
  RealtimeDeniedModal,
  TestableLinkModal,
} from '@/pages/Dashboard/RestrictionModals';
import PaymentModal from '@/pages/Payment/PaymentModal';
import LoginModal from '@/pages/Publish/Upload/common/LoginModal';
import { compose } from '@/utils/functional';

import { GlobalProvidersProps, withGlobalProviders } from './contexts/GlobalProviders';
import Routes from './Routes';

const App = () => {
  useSessionTracking();

  return (
    <>
      <SeoHelmet page={SeoPage.ROOT} />
      <SuccessModal />
      <ConfirmModal />
      <ErrorModal />
      <ModalBackdrop />
      <Modal />
      <ToastContainer />
      <Routes />
      <IntercomChat />
      <CollaboratorsModal />
      <ImportModal />
      <LoadingModal />
      <TagManagerModal />

      <ProjectDownloadModal />
      <TestableLinkModal />
      <CanvasExportModal />
      <ProjectLimitModal />
      <RealtimeDeniedModal />
      <ImportBulkDeniedModal />
      <PaymentModal />
      <RefreshModal />
      <LoginModal />
    </>
  );
};

export default compose(
  hot,
  withGlobalProviders,
  withBatchLoadingGate(FeatureLoadingGate, SocketLoadingGate, AccountLoadingGate, GlobalSocketSubscriptionsLoadingGate)
)(App) as React.FC<GlobalProvidersProps>;
