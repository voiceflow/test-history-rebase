import { ModalBoldText } from '@voiceflow/ui';
import React from 'react';

import { integrationGraphic } from '@/assets';
import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const CanvasExportModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.CANVAS_EXPORT}
    header="Export"
    icon={integrationGraphic}
    bodyContent={
      <>
        This is a <ModalBoldText>Pro</ModalBoldText> feature. Please upgrade your workspace to use the Export feature.
      </>
    }
  />
);

export default CanvasExportModal;
