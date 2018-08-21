import React, { Component } from 'react';
import { Button, Modal, ModalBody, Alert } from 'reactstrap';

class LoadingModal extends Component {

  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
  }

  render() {
    return (
        <Modal isOpen={this.props.open} centered size="sm">
          <ModalBody className="text-center">
            {this.props.error ? 
              <div>
                <h5><i class="fas fa-exclamation-triangle text-danger"></i> Error</h5>
                <Alert color="danger">
                  {this.props.error}
                </Alert>
                <hr/>
                <Button color="primary" onClick={this.props.dismiss}>Return <i class="fas fa-undo"></i></Button>
              </div>
              :
              <div>
                <h5>Loading...</h5>
                <hr/>
                <h1><i className="fas fa-sync-alt fa-spin"></i></h1>
              </div>
            }
          </ModalBody>
        </Modal>
    );
  }
}

export default LoadingModal;