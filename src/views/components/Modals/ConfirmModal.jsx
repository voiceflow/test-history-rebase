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
      <Modal isOpen={!!this.props.confirm} toggle={this.props.toggle} centered size={this.props.confirm.size || "sm"}>
        <ModalBody className="text-center">
          {this.props.confirm.text}
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color={this.props.confirm.warning ? "warning" : "primary"} 
            onClick={() => {
              if(this.props.confirm.params){
                this.props.confirm.confirm(...this.props.confirm.params)
              } else {
                this.props.confirm.confirm()
              }
            }}>
            Confirm
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmModal