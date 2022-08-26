import React from 'react';

import ConfirmModal from '@/components/ConfirmModal';
import { ErrorModal, LoadingModal, ModalBackdrop, ReduxConfirmModal, StandardModal, SuccessModal, UpgradeModal } from '@/components/modals';
import PublishVersionModal from '@/components/PublishVersionModal';
import RefreshModal from '@/components/RefreshModal';
import { VariableStateEditorModal, VariableStatesManagerModal } from '@/components/VariableStateModals';
import ConnectActivePlatformModal from '@/modals/ConnectActivePlatformModal';
import ConnectAmazonModal from '@/modals/ConnectAmazonModal';
import ConnectGoogleModal from '@/modals/ConnectGoogleModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateEntityModal from '@/pages/Canvas/components/EntityModalsV2/CreateModal';
import EditEntityModal from '@/pages/Canvas/components/EntityModalsV2/EditModal';
import CreateIntentModal from '@/pages/Canvas/components/IntentModalsV2/CreateModal';
import EditIntentModal from '@/pages/Canvas/components/IntentModalsV2/EditModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';
import CollaboratorsModal from '@/pages/Collaborators/CollaboratorsModal';
import TagManagerModal from '@/pages/Conversations/components/TagManagerModal';
import ImportModal from '@/pages/Dashboard/components/ImportModal';
import {
  CanvasExportModal,
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
      <ReduxConfirmModal />
      <ErrorModal />
      <StandardModal />
      <CollaboratorsModal />
      <ImportModal />
      <UpgradeModal />
      <LoadingModal />
      <TagManagerModal />

      <EditIntentModal />
      <CreateIntentModal />
      <CreateEntityModal />
      <CreateVariableModal />
      <EditEntityModal />

      <VariableStatesManagerModal />
      <VariableStateEditorModal />
      <ProjectDownloadModal />
      <TestableLinkModal />
      <CanvasExportModal />
      <ProjectLimitModal />
      <RealtimeDeniedModal />
      <PaymentModal />
      <RefreshModal />
      <ConnectActivePlatformModal />
      <ConnectAmazonModal />
      <ConnectGoogleModal />
      <Dialogflow.Components.CreateNewAgentModal />

      <BulkImportSlots />
      <BulkImportUtterances />
      <ProjectCreateModal />

      <PublishVersionModal />
    </>
  );
};

export default AppModals;
