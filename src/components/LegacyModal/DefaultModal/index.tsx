import React from 'react';

import Button from '@/components/Button';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

const ModalComponent: React.FC<any> = Modal;

export type DefaultModalProps = {
  open?: boolean;
  noPadding?: boolean;
  hideFooter?: boolean;
  close_button_text?: string;
  toggle?: () => void;
  header: React.ReactNode;
  content: React.ReactNode;
};

const DefaultModal: React.FC<DefaultModalProps> = ({ open, toggle, header, content, noPadding, hideFooter, close_button_text }) => (
  <ModalComponent isOpen={open} toggle={toggle}>
    <ModalHeader toggle={toggle} header={header} />
    <ModalBody
      style={{
        padding: noPadding ? '0' : undefined,
        border: '0',
        overflow: 'none',
      }}
    >
      {content}
    </ModalBody>
    {!hideFooter && (
      <ModalFooter className="super-center">
        {close_button_text ? (
          <Button onClick={toggle}>{close_button_text}</Button>
        ) : (
          <Button variant="tertiary" onClick={toggle}>
            Close
          </Button>
        )}
      </ModalFooter>
    )}
  </ModalComponent>
);

export default DefaultModal;
