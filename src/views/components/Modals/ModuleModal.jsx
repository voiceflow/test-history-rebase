/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import withRenderModuleIcon from '../../HOC/ModuleIcon'
import React from 'react';
import { Modal, ModalBody } from 'reactstrap';

class ModuleModal extends React.Component {

  render() {
    console.log(this.props.module)
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalBody>
          {this.props.module && this.props.renderIcon(this.props.module)}
        </ModalBody>
      </Modal>
    );
  }
}

export default withRenderModuleIcon(ModuleModal)
