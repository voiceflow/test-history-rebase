import React from 'react';

import ConfirmModalV2 from '@/components/ConfirmModal';
import { ConfirmModal, ErrorModal, LoadingModal, ModalBackdrop, StandardModal, SuccessModal } from '@/components/modals';
import RefreshModal from '@/components/RefreshModal';
import { VariableStateEditorModal, VariableStatesLimitModal, VariableStatesManagerModal } from '@/components/VariableStateModals';
import ConnectActivePlatformModal from '@/modals/ConnectActivePlatformModal';
import ConnectAmazonModal from '@/modals/ConnectAmazonModal';
import ConnectGoogleModal from '@/modals/ConnectGoogleModal';
import ChangeEmailModal from '@/pages/Account/components/ChangeEmailModal';
import ChangePasswordModal from '@/pages/Account/components/ChangePasswordModal';
import ProfileNameModal from '@/pages/Account/components/ProfileNameModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateEntityModal from '@/pages/Canvas/components/EntityModalsV2/CreateModal';
import EditEntityModal from '@/pages/Canvas/components/EntityModalsV2/EditModal';
import CreateIntentModal from '@/pages/Canvas/components/IntentModalsV2/CreateModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';
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
import ProjectCreateModal from '@/pages/NewProjectV2/NewProjectModal';
import PaymentModal from '@/pages/Payment/PaymentModal';
import { Dialogflow } from '@/platforms';

const AppModals: React.FC = () => {
  return (
    <>
      <ModalBackdrop />
      <SuccessModal />
      <ConfirmModal />
      <ConfirmModalV2 />
      <ErrorModal />
      <StandardModal />
      <CollaboratorsModal />
      <ImportModal />
      <ProfileNameModal />
      <ChangeEmailModal />
      <ChangePasswordModal />
      <LoadingModal />
      <TagManagerModal />

      <CreateIntentModal />
      <CreateEntityModal />
      <CreateVariableModal />
      <EditEntityModal />

      <VariableStatesManagerModal />
      <VariableStateEditorModal />
      <VariableStatesLimitModal />
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
      <Dialogflow.Components.CreateNewAgentModal />

      <BulkImportSlots />
      <BulkImportUtterances />
      <ProjectCreateModal />
    </>
  );
};

export default AppModals;
