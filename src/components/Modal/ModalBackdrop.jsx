import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { ModalsContext } from '@/contexts/ModalsContext';
import { createGlobalStyle } from '@/hocs';
import { stopImmediatePropagation } from '@/utils/dom';

const StyledBackdropModal = createGlobalStyle`
  .modal-backdrop-invisible {
    opacity: 0 !important;
  }
`;

const ModalBackdrop = () => {
  const { openedId, close } = React.useContext(ModalsContext) || {};

  return (
    <ReactstrapModal isOpen={!!openedId} zIndex="1000" onPaste={stopImmediatePropagation()} toggle={() => close(openedId)}>
      <StyledBackdropModal />
    </ReactstrapModal>
  );
};

export default ModalBackdrop;
