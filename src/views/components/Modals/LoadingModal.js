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
                <h5><i className="fas fa-exclamation-triangle text-danger"></i> Error</h5>
                <Alert color="danger">
                  {this.props.error}
                </Alert>
                <hr/>
                <Button color="primary" onClick={this.props.dismiss}>Return <i className="fas fa-undo"></i></Button>
              </div> : null
            }
            {this.props.success ? 
              <div>
                <Alert color="success">
                  {this.props.success}
                </Alert>
                <hr/>
                <Button color="primary" onClick={this.props.dismiss}>Return <i className="fas fa-undo"></i></Button>
              </div> : null
            }
            {!this.props.error && !this.props.success ? 
              <div>
                <h5>Loading...</h5>
                <hr/>
                <h1><i className="fas fa-sync-alt fa-spin"></i></h1>
              </div> : null
            }
          </ModalBody>
        </Modal>
    );
  }
}

export default LoadingModal;