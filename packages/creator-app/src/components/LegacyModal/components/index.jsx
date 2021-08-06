import { stopImmediatePropagation } from '@voiceflow/ui';
import cn from 'classnames';
import _isBoolean from 'lodash/isBoolean';
import React from 'react';
import { Modal as ReactstrapModal } from 'reactstrap';

import { ModalsContext } from '@/contexts';
import { css, styled } from '@/hocs';
import { ClassName } from '@/styles/constants';

import ModalBackdrop from './ModalBackdrop';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

const BaseModal = styled(({ modalWidth, notAllowed, ...props }) => <ReactstrapModal {...props} />)`
  ${({ modalname, theme }) =>
    modalname &&
    css`
      max-width: ${theme.components.modals[modalname]?.width}px !important;
    `}
  ${({ notAllowed }) => notAllowed && 'cursor: not-allowed'};
`;

const Modal = ({ className, ...props }) => {
  const { fade, openedId } = React.useContext(ModalsContext) || {};

  return (
    <BaseModal
      {...props}
      className={cn(ClassName.MODAL, className, `${ClassName.MODAL}--${props.modalname}`)}
      fade={_isBoolean(props.fade) ? props.fade && fade : fade}
      onPaste={stopImmediatePropagation()}
      backdropClassName={openedId ? 'modal-backdrop-invisible' : ''}
    />
  );
};

export default Modal;

export { Modal, ModalBackdrop, ModalBody, ModalFooter, ModalHeader };
