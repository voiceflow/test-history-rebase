import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class MarketplaceModal extends React.Component {

  render() {
    return (
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size="sm">
        <ModalBody className="text-center">
          {this.props.confirm.text}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="primary" onClick={this.props.confirm.confirm}>Confirm</Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal;