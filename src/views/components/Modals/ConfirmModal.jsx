/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { clearModal } from "ducks/modal";

export class ConfirmModal extends React.Component {
  // TODO this class is pure cancer
  render() {
    if (!this.props.confirm) {
      return null;
    }
    const cancel =
      this.props.confirm.cancel !== undefined
        ? this.props.confirm.cancel
        : true;
    return (
      <Modal
        isOpen={!!this.props.confirm}
        toggle={this.props.toggle}
        centered
        size={this.props.confirm.size || "sm"}
      >
        {this.props.confirm.header && (
          <ModalHeader toggle={this.props.toggle}>
            {this.props.confirm.header}
          </ModalHeader>
        )}
        <ModalBody className="text-center">{this.props.confirm.text}</ModalBody>
        <ModalFooter className="justify-content-center">
          {cancel && (
            <Button
              className="previous-btn"
              color="clear"
              onClick={this.props.toggle}
            >
              Cancel
            </Button>
          )}
          <Button
            className="faux-purple-btn"
            color={this.props.confirm.warning ? "warning" : "primary"}
            onClick={() => {
              if (typeof this.props.confirm.confirm !== "function")
                return this.props.toggle();
              if (this.props.confirm.params) {
                this.props.confirm.confirm(...this.props.confirm.params);
              } else {
                this.props.confirm.confirm();
              }
              this.props.toggle();
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  confirm: state.modal.confirmModal
});

const mapDispatchToProps = dispatch => {
  return {
    toggle: () => dispatch(clearModal())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmModal);
