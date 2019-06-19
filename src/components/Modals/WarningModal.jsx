import React, { PureComponent } from 'react';
import { Alert, Button, Modal, ModalBody } from 'reactstrap';

class WarningModal extends PureComponent {
  render() {
    return (
      <Modal isOpen={!!this.props.error} centered size="sm" fade={false}>
        <ModalBody className="text-center">
          <div>
            <h5>
              <i className="fas fa-exclamation-triangle text-danger" /> Error
            </h5>
            <Alert color="danger">{this.props.error}</Alert>
            <hr />
            <Button color="primary" onClick={this.props.dismiss}>
              Return <i className="fas fa-undo" />
            </Button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default WarningModal;
