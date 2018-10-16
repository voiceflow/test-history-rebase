import React, { Component } from 'react';
import { Button, Modal, ModalBody, Alert } from 'reactstrap';

class ErrorModal extends Component {

  componentDidMount() {
  }

  render() {
    if(!this.props.error) return null;

    return (
        <Modal isOpen={!!this.props.error} centered size="sm">
          <ModalBody className="text-center">
            <h5><i className="fas fa-exclamation-triangle text-danger"></i> Error</h5>
            <Alert color="danger">
              {this.props.error}
            </Alert>
            <hr/>
            <Button color="primary" onClick={this.props.dismiss}>Return <i className="fas fa-undo"></i></Button>
          </ModalBody>
        </Modal>
    );
  }
}

export default ErrorModal;