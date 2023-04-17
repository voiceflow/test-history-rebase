import React from 'react';

import { ModalBackdrop } from '@/components/modals';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateIntentModal from '@/pages/Canvas/components/IntentModalsV2/CreateModal';
import EditIntentModal from '@/pages/Canvas/components/IntentModalsV2/EditModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';

const AppModals: React.FC = () => {
  return (
    <>
      <ModalBackdrop />

      <EditIntentModal />
      <CreateIntentModal />
      <CreateVariableModal />

      <BulkImportSlots />
      <BulkImportUtterances />
    </>
  );
};

export default AppModals;
