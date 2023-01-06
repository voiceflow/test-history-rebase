import React from 'react';

import { integrationGraphic } from '@/assets';
import { ModalType } from '@/constants';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const CanvasExportModal: React.OldFC = () => (
  <BaseModal
    modalType={ModalType.CANVAS_EXPORT}
    header="Export"
    icon={integrationGraphic}
    bodyContent={
      <>
        This is a <b>Pro</b> feature. Please upgrade your workspace to use the Export feature.
      </>
    }
  />
);

export default CanvasExportModal;
