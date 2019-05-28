import React from 'react';
import {connect} from 'react-redux';
import {Modal, ModalHeader, ModalBody, ModalFooter, Alert} from 'reactstrap';
import Button from 'components/Button';

import './AdminAdvancedModal.css';

class AdminAdvancedModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.showModal,
      nestedCancelModal: false,
      nestedRefundModal: false,
      closeAll: false
    };
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  toggleNested = (type) => {
    if (type === 'cancel') {
      this.setState({
        nestedCancelModal: !this.state.nestedCancelModal,
        closeAll: false
      });
    } else {
      this.setState({
        nestedRefundModal: !this.state.nestedRefundModal,
        closeAll: false
      })
    }
  };

  closeAll = () => {
    this.setState({
      nestedCancelModal: false,
      nestedRefundModal: false,
      modal: false,
      closeAll: true
    });
  };

  render() {
    return (
      <div>
        <span className="trigger_modal_link" onClick={this.toggle}>{this.props.buttonLabel}</span>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <div className="am__title" onClick={this.toggle}>
            DANGER ZONE
            <div className="close am__close"></div>
          </div>
          <ModalBody className="am__body">
            <div className="am__action_header">
              Cancel Subscription
            </div>
            <div className="am__action_body">
              Cancel the subscription for creator #{this.props.user.creator_id}
              <div className="am__button_row">
                <Button isWarning onClick={() => this.toggleNested('cancel')}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
            <hr/>
            <div className="am__action_header">
              Refund User
            </div>
            <div className="am__action_body">
              Cancel the subscription for creator #{this.props.user.creator_id} and refund them.
              <div className="am__button_row">
                <Button isWarning onClick={() => this.toggleNested('refund')}>
                  REFUND
                </Button>
              </div>
            </div>

            <Modal isOpen={this.state.nestedCancelModal} toggle={() => this.toggleNested('cancel')}>
              <ModalHeader>Cancel Subscription for Creator #{this.props.user.creator_id}</ModalHeader>
              <ModalBody>
                <Alert color="danger between">
                  <span className="am__confirm_message">rip user 😭😭😭</span>
                  <br/>
                  <Button isWarning>
                    Cancel Subscription
                  </Button>
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button isSecondary onClick={this.closeAll}>Cancel</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.nestedRefundModal} toggle={() => this.toggleNested('refund')}>
              <ModalHeader>Refund Creator #{this.props.user.creator_id}</ModalHeader>
              <ModalBody>
                <Alert color="danger between">
                  <span className="am__confirm_message">R u sure we like our money in our banks 😫</span>
                  <br/>
                  <Button isWarning>
                    Refund User
                  </Button>
                </Alert>
              </ModalBody>
              <ModalFooter>
                <Button isSecondary onClick={this.closeAll}>Cancel</Button>
              </ModalFooter>
            </Modal>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect()(AdminAdvancedModal);
