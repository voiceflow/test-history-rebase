// Import Dependent CSS
import 'react-tippy/dist/tippy.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'simplebar/dist/simplebar.min.css';
import './App.css';
import 'react-day-picker/lib/style.css';

import { ToastContainer } from '@voiceflow/ui';
import React from 'react';

import ConfirmModalV2 from '@/components/ConfirmModal';
import IntercomChat from '@/components/IntercomChat';
import { ConfirmModal, ErrorModal, LoadingModal, ModalBackdrop, StandardModal, SuccessModal } from '@/components/modals';
import { RootPageProgressBar } from '@/components/PageProgressBar';
import CreateNewAgentModal from '@/components/PlatformUploadPopup/Dialogflow/CreateNewAgentModal';
import RefreshModal from '@/components/RefreshModal';
import SeoHelmet from '@/components/SeoHelmet';
import VariableStateCreationModal from '@/components/VariableStateCreationModal';
import { VariableStatesManagerModal } from '@/components/VariableStateModals';
import { SeoPage } from '@/constants/seo';
import { GlobalSocketSubscriptionsLoadingGate } from '@/gates';
import { compose, withBatchLoadingGate } from '@/hocs';
import { useSessionTracking } from '@/hooks';
import ConnectActivePlatformModal from '@/modals/ConnectActivePlatformModal';
import ConnectAmazonModal from '@/modals/ConnectAmazonModal';
import ConnectGoogleModal from '@/modals/ConnectGoogleModal';
import ChangeEmailModal from '@/pages/Account/components/ChangeEmailModal';
import ChangePasswordModal from '@/pages/Account/components/ChangePasswordModal';
import ProfileNameModal from '@/pages/Account/components/ProfileNameModal';
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

import { GlobalProvidersProps, withGlobalProviders } from './contexts/GlobalProviders';
import Routes from './Routes';

const App = () => {
  useSessionTracking();

  return (
    <>
      <SeoHelmet page={SeoPage.ROOT} />
      <ModalBackdrop />
      <SuccessModal />
      <ConfirmModal />
      <ConfirmModalV2 />
      <ErrorModal />
      <StandardModal />
      <ToastContainer />
      <Routes />
      <IntercomChat />
      <CollaboratorsModal />
      <ImportModal />
      <ProfileNameModal />
      <ChangeEmailModal />
      <ChangePasswordModal />
      <LoadingModal />
      <TagManagerModal />
      <VariableStateCreationModal />
      <VariableStatesManagerModal />

      <ProjectDownloadModal />
      <TestableLinkModal />
      <CanvasExportModal />
      <ProjectLimitModal />
      <RealtimeDeniedModal />
      <ImportBulkDeniedModal />
      <PaymentModal />
      <RefreshModal />
      <ConnectActivePlatformModal />
      <ConnectAmazonModal />
      <ConnectGoogleModal />
      <CreateNewAgentModal />

      <RootPageProgressBar />
    </>
  );
};

export default compose(withGlobalProviders, withBatchLoadingGate(GlobalSocketSubscriptionsLoadingGate))(App) as React.FC<GlobalProvidersProps>;
