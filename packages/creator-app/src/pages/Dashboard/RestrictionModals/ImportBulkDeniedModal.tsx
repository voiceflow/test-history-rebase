import { ModalBoldText } from '@voiceflow/ui';
import React from 'react';

import { bulkImportGraphic } from '@/assets';
import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const ImportBulkDeniedModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.IMPORT_BULK_DENIED}
    header="Bulk Import"
    icon={bulkImportGraphic}
    bodyContent={
      <>
        This is a <ModalBoldText>Pro</ModalBoldText> feature. Please upgrade your workspace to bulk import content.
      </>
    }
  />
);

export default ImportBulkDeniedModal;
