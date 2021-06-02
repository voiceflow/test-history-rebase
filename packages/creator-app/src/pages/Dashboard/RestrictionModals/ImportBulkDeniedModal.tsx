import React from 'react';

import { bulkImportGraphic } from '@/assets';
import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const ImportBulkDeniedModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.IMPORT_BULK_DENIED}
    header="Bulk Import"
    icon={bulkImportGraphic}
    bodyContent={
      <>
        This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to bulk import content.
      </>
    }
  />
);

export default ImportBulkDeniedModal;
