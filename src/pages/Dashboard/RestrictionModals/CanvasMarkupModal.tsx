import React from 'react';

import { canvasMarkupGraphic } from '@/assets';
import * as Documentation from '@/config/documentation';
import { ModalType } from '@/constants';
import { BoldText } from '@/pages/Dashboard/components/ModalComponents';
import BaseModal from '@/pages/Dashboard/components/RedirectToPaymentBaseModal';
import { ClassName } from '@/styles/constants';

const CanvasMarkupModal: React.FC = () => (
  <BaseModal
    modalType={ModalType.CANVAS_MARKUP}
    className={`${ClassName.MODAL}--markup`}
    header="Canvas Markup"
    icon={canvasMarkupGraphic}
    helpLink={Documentation.MARKUP_FEATURE}
    bodyContent={
      <>
        This is a <BoldText>Pro</BoldText> feature. Please upgrade your workspace to access Canvas Markup.
      </>
    }
  />
);

export default CanvasMarkupModal;
