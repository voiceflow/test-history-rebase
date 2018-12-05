/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

class ConfirmModal extends React.Component {

  render() {
    return (
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size="sm">
        <ModalBody className="text-center">
          {this.props.confirm.text}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button className="btn-primary" onClick={this.props.confirm.confirm}>Confirm</Button>{' '}
          <Button className="white-btn" onClick={this.props.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal