import _isBoolean from 'lodash/isBoolean';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { ModalsContext } from '@/contexts';
import { css, styled } from '@/hocs';
import { stopImmediatePropagation } from '@/utils/dom';

import ModalBackdrop from './ModalBackdrop';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

const BaseModal = styled(ReactstrapModal)`
  ${({ modalname, theme }) =>
    modalname &&
    css`
      max-width: ${theme.components.modals[modalname].width}px !important;
    `}
`;

const Modal = (props) => {
  const { fade, openedId } = React.useContext(ModalsContext) || {};

  return (
    <BaseModal
      {...props}
      fade={_isBoolean(props.fade) ? props.fade && fade : fade}
      onPaste={stopImmediatePropagation()}
      backdropClassName={openedId ? 'modal-backdrop-invisible' : ''}
    />
  );
};

export default Modal;

export { ModalHeader, ModalBackdrop, Modal, ModalBody, ModalFooter };
