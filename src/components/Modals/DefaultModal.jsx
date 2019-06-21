import Button from 'components/Button';
import { ModalHeader } from 'components/Modals/ModalHeader';
import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const DefaultModal = (props) => {
  return (
    <Modal isOpen={props.open} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle} header={props.header} />
      <ModalBody
        style={{
          padding: props.noPadding ? '0' : undefined,
          border: '0',
          overflow: 'none',
        }}
      >
        {props.content}
      </ModalBody>
      {!props.hideFooter && (
        <ModalFooter className="super-center">
          {props.close_button_text ? (
            <Button isPrimary type="button" onClick={props.toggle}>
              {props.close_button_text}
            </Button>
          ) : (
            <Button isClear type="button" onClick={props.toggle}>
              Close
            </Button>
          )}
        </ModalFooter>
      )}
    </Modal>
  );
};

export default DefaultModal;
