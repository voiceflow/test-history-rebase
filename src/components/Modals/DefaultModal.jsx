/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { ModalHeader } from 'components/Modals/ModalHeader'
import Button from 'components/Button'

class DefaultModal extends React.Component {

  render() {
    return (
      <Modal isOpen={this.props.open} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle} header={this.props.header} />
        <ModalBody style={{ padding: this.props.noPadding ? '0' : undefined, border: '0', overflow: "none"}}>
          {this.props.content}
        </ModalBody>
        {!this.props.hideFooter && <ModalFooter className="super-center">
          {this.props.close_button_text ?
            <Button isPrimary type="button" onClick={this.props.toggle}>{this.props.close_button_text}</Button>
            : <Button isClear type="button" onClick={this.props.toggle}>Close</Button>
          }
        </ModalFooter>}
      </Modal>
    );
  }
}

export default DefaultModal;
