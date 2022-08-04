import { Modal, Portal, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

interface BackdropProps {
  closing: boolean;
  onClose: VoidFunction;
}

const Backdrop: React.FC<BackdropProps> = ({ closing, onClose }) => (
  <Portal portalNode={document.body}>
    <Modal.Backdrop closing={closing} onPaste={stopImmediatePropagation()} onClick={onClose} />
  </Portal>
);

export default Backdrop;
