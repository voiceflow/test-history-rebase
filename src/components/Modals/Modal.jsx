/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { connect } from "react-redux";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
import { ModalHeader } from 'components/Modals/ModalHeader'

import { clearModal } from "ducks/modal";

export class StandardModal extends React.Component {
  // TODO this class is pure cancer
  render() {
    if (!this.props.modal) {
      return null;
    }

    return (
      <Modal
        isOpen={!!this.props.modal}
        toggle={this.props.toggle}
        centered
        size={this.props.modal.size}
      >
        {this.props.modal.header && (
          <ModalHeader toggle={this.props.toggle}>
            {this.props.modal.header}
          </ModalHeader>
        )}
        {this.props.modal.body && <ModalBody className="text-center">{this.props.modal.body}</ModalBody>}
        {this.props.modal.footer && <ModalFooter className="justify-content-center">
          {this.props.modal.footer}
        </ModalFooter>}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal.modal
});

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => dispatch(clearModal())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardModal);
