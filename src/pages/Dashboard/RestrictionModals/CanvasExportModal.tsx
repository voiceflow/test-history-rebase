import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const CanvasExportModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.CANVAS_EXPORT}
    header="Export"
    icon="/integration.svg"
    bodyContent={
      <>
        This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to use the Export feature.
      </>
    }
  />
);

export default CanvasExportModal;
