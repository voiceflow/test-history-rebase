import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { stopImmediatePropagation } from '@/utils/dom';

import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

const Modal = (props) => <ReactstrapModal {...props} onPaste={stopImmediatePropagation()} />;

export { ModalHeader, Modal, ModalBody, ModalFooter };

export default Modal;
