import Button from 'components/Button';
import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';

class TemplateConfirmModal extends React.Component {
  render() {
    return (
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size="md">
        <ModalBody className="text-center">{this.props.confirm.text}</ModalBody>
        <ModalFooter className="justify-content-center">
          <Button isPrimary onClick={this.props.confirm.replaceWithTemplate}>
            Replace
          </Button>{' '}
          <Button isPrimary onClick={this.props.confirm.createFlow}>
            Create New Flow
          </Button>{' '}
          <Button isSecondary onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TemplateConfirmModal;
