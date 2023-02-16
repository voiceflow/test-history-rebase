import { Modal, Portal, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

interface BackdropProps {
  closing: boolean;
  onClose: VoidFunction;
  closePrevented?: boolean;
}

const Backdrop: React.FC<BackdropProps> = ({ onClose, closing, closePrevented }) => (
  <Portal portalNode={document.body}>
    <Modal.Backdrop
      closing={closing}
      onPaste={stopImmediatePropagation()}
      onClick={() => !closePrevented && onClose()}
      closePrevented={closePrevented}
    />
  </Portal>
);

export default Backdrop;
