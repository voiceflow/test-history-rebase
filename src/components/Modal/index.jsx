import _isBoolean from 'lodash/isBoolean';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { ModalsContext } from '@/contexts/ModalsContext';
import { stopImmediatePropagation } from '@/utils/dom';

import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

const Modal = (props) => {
  const { fade, openedId } = React.useContext(ModalsContext) || {};

  return (
    <ReactstrapModal
      {...props}
      fade={_isBoolean(props.fade) ? props.fade && fade : fade}
      onPaste={stopImmediatePropagation()}
      backdropClassName={openedId ? 'modal-backdrop-invisible' : ''}
    />
  );
};

export { ModalHeader, Modal, ModalBody, ModalFooter };

export default Modal;
