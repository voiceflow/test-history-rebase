/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

class DefaultModal extends React.Component {

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          {this.props.header}
        </ModalHeader>
        <ModalBody>
          {this.props.content}
        </ModalBody>
        <ModalFooter className="super-center">
            <button type="button" className="purple-btn" onClick={this.props.toggle}>{this.props.close_button_text? this.props.close_button_text: "Close"}</button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DefaultModal;
