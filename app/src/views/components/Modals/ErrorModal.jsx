import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, Alert } from 'reactstrap';
import { clearModal } from 'actions/modalActions'

export class ErrorModal extends Component {

  render() {
    if(!this.props.error) return null;

    return (
        <Modal isOpen={!!this.props.error} centered size="sm">
          <ModalBody className="text-center">
            <h5><i className="fas fa-exclamation-triangle text-danger"></i> Error</h5>
            {this.props.error.message ? 
              <React.Fragment>
                <Alert color="danger">
                  {this.props.error.message}
                </Alert>
                {
                  this.props.error.violations ? this.props.error.violations.map(
                    (violation, i) => <Alert color="danger" key={i}>
                      {violation.message}
                    </Alert>
                  ) : null
                }
              </React.Fragment> :
              <Alert color="danger">
                {this.props.error}
              </Alert>
            }
            <hr/>
            <Button color="primary" onClick={this.props.dismiss}>Return <i className="fas fa-undo"></i></Button>
          </ModalBody>
        </Modal>
    );
  }
}

const mapStateToProps = state => ({
  error: state.modal.errorModal
})

const mapDispatchToProps = dispatch => {
  return {
    dismiss: () => dispatch(clearModal())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);