import React from 'react';

import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';
import { ClassName } from '@/styles/constants';

const CanvasMarkupModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.CANVAS_MARKUP}
    className={`${ClassName.MODAL}--markup`}
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

export default CanvasMarkupModal;
