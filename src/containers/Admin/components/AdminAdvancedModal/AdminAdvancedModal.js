import React from 'react';
import {connect} from 'react-redux';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import './AdminAdvancedModal.css';

class AdminAdvancedModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: this.props.showModal,
      nestedModal: false,
      closeAll: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  render() {
    return (
      <div>
        <span className="trigger_modal_link" onClick={this.toggle}>{this.props.buttonLabel}</span>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <div className="am__title" onClick={this.toggle}>
            Advanced Actions
          </div>
          <ModalBody className="am__body">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
            <br/>
            <Button color="success" onClick={this.toggleNested}>Show Nested Modal</Button>
            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested}
                   onClosed={this.state.closeAll ? this.toggle : undefined}>
              <ModalHeader>Nested Modal title</ModalHeader>
              <ModalBody>Stuff and things</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.toggleNested}>Done</Button>{' '}
                <Button color="secondary" onClick={this.toggleAll}>All Done</Button>
              </ModalFooter>
            </Modal>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect()(AdminAdvancedModal);
