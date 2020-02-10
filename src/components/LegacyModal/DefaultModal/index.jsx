import React from 'react';

import Button from '@/components/Button';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

const DefaultModal = ({ open, toggle, header, content, noPadding, hideFooter, close_button_text }) => {
  return (
    <Modal isOpen={open} toggle={toggle}>
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
    </Modal>
  );
};

export default DefaultModal;
