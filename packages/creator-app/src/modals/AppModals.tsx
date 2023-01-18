import React from 'react';

import ConfirmModal from '@/components/ConfirmModal';
import { ModalBackdrop, ReduxConfirmModal, StandardModal, UpgradeModal } from '@/components/modals';
import PublishVersionModal from '@/components/PublishVersionModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateEntityModal from '@/pages/Canvas/components/EntityModalsV2/CreateModal';
import EditEntityModal from '@/pages/Canvas/components/EntityModalsV2/EditModal';
import CreateIntentModal from '@/pages/Canvas/components/IntentModalsV2/CreateModal';
import EditIntentModal from '@/pages/Canvas/components/IntentModalsV2/EditModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';
import { CanvasExportModal, RealtimeDeniedModal, TestableLinkModal } from '@/pages/Dashboard/RestrictionModals';
import PaymentModal from '@/pages/Payment/PaymentModal';

const AppModals: React.OldFC = () => {
  return (
    <>
      <ModalBackdrop />
      <ConfirmModal />
      <ReduxConfirmModal />
      <StandardModal />
      <UpgradeModal />

      <EditIntentModal />
      <CreateIntentModal />
      <CreateEntityModal />
      <CreateVariableModal />
      <EditEntityModal />

      <TestableLinkModal />
      <CanvasExportModal />
      <RealtimeDeniedModal />
      <PaymentModal />

      <BulkImportSlots />
      <BulkImportUtterances />

      <PublishVersionModal />
    </>
  );
};

export default AppModals;
