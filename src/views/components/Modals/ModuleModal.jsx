/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

class ModuleModal extends React.Component {

  render() {
    console.log(this.props.module)
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalBody>
          Sup
        </ModalBody>
      </Modal>
    );
  }
}

export default ModuleModal;
