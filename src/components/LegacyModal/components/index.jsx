import cn from 'classnames';
import _isBoolean from 'lodash/isBoolean';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { ModalsContext } from '@/contexts';
import { css, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';
import { stopImmediatePropagation } from '@/utils/dom';

import ModalBackdrop from './ModalBackdrop';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

const BaseModal = styled(({ modalWidth, ...props }) => <ReactstrapModal {...props} />)`
  ${({ modalname, theme }) =>
    modalname &&
    css`
      max-width: ${theme.components.modals[modalname].width}px !important;
    `}
`;

const Modal = ({ className, ...props }) => {
  const { fade, openedId } = React.useContext(ModalsContext) || {};

  return (
    <BaseModal
      {...props}
      className={cn(ClassName.MODAL, className)}
      fade={_isBoolean(props.fade) ? props.fade && fade : fade}
      onPaste={stopImmediatePropagation()}
      backdropClassName={openedId ? 'modal-backdrop-invisible' : ''}
    />
  );
};

export default Modal;

export { ModalHeader, ModalBackdrop, Modal, ModalBody, ModalFooter };
