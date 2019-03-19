/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class ModuleModal extends React.Component {

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>
          {this.props.header}
        </ModalHeader>
        <ModalBody style={{ border: '0', overflow: "none"}}>
          Sup
        </ModalBody>
      </Modal>
    );
  }
}

export default ModuleModal;
