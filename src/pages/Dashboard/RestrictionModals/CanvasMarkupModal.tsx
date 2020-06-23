import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';

const CanvasMarkupModal: React.FC = () => {
  return (
    <BaseModal
      modalType={ModalType.CANVAS_MARKUP}
      header="Canvas Markup"
      icon="/canvas-markup.svg"
      helpLink="https://docs.voiceflow.com/#/features/markup"
      bodyContent={
        <>
          This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to access Canvas Markup.
        </>
      }
    />
  );
};

export default CanvasMarkupModal;
