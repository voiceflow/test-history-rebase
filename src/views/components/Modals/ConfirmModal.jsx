/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

import { clearModal } from 'ducks/modal'

export class ConfirmModal extends React.Component {
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
          <Button className="previous-btn" color="clear" onClick={this.props.toggle}>Cancel</Button>
          <Button className="faux-purple-btn" color={this.props.confirm.warning ? "warning" : "primary"} 
            onClick={() => {
              if(this.props.confirm.params){
                this.props.confirm.confirm(...this.props.confirm.params)
              } else {
                this.props.confirm.confirm()
              }
              this.props.toggle()
            }}>
            Confirm
          </Button>{' '}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  confirm: state.modal.confirmModal
})

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => dispatch(clearModal())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)