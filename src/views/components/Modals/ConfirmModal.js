/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

class ConfirmModal extends React.Component {
  // TODO this class is pure cancer
  render() {
    if(!this.props.confirm){
      return null
    }
    return (
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size="sm">
        <ModalBody className="text-center">
          {this.props.confirm.text}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="clear" onClick={this.props.toggle}>Cancel</Button>
          <Button color={this.props.confirm.warning ? "warning" : "primary"} onClick={this.props.confirm.confirm}>Confirm</Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal