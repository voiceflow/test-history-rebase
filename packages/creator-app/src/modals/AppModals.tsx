import React from 'react';

import { ModalBackdrop } from '@/components/modals';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateEntityModal from '@/pages/Canvas/components/EntityModalsV2/CreateModal';
import EditEntityModal from '@/pages/Canvas/components/EntityModalsV2/EditModal';
import CreateIntentModal from '@/pages/Canvas/components/IntentModalsV2/CreateModal';
import EditIntentModal from '@/pages/Canvas/components/IntentModalsV2/EditModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';

const AppModals: React.FC = () => {
  return (
    <>
      <ModalBackdrop />

      <EditIntentModal />
      <CreateIntentModal />
      <CreateEntityModal />
      <CreateVariableModal />
      <EditEntityModal />

      <BulkImportSlots />
      <BulkImportUtterances />
    </>
  );
};

export default AppModals;
