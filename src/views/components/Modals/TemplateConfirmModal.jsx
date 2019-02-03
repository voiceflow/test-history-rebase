/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

class TemplateConfirmModal extends React.Component {

  render() {
    return (
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size="md">
        <ModalBody className="text-center">
          {this.props.confirm.text}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="primary" onClick={this.props.confirm.replaceWithTemplate}>Replace</Button>{' '}
          <Button color="primary" onClick={this.props.confirm.createFlow}>Create New Flow</Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default TemplateConfirmModal;