import { ModalHeader } from 'components/Modals/ModalHeader';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Modal, ModalBody } from 'reactstrap';

class ExpandedEditorView extends PureComponent {
  render() {
    const { isOpen, nodeName, editorRender } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={this.onClosed} onClosed={this.onClosed} size="lg">
        <ModalHeader toggle={this.onClosed} header={`${nodeName} Settings`} />
        <ModalBody className="pb-4 px-4">{editorRender()}</ModalBody>
      </Modal>
    );
  }

  onClosed = () => this.props.updateState('expanded', false);
}

ExpandedEditorView.propTypes = {
  isOpen: PropTypes.bool,
  updateState: PropTypes.state,
  nodeName: PropTypes.string,
  editorRender: PropTypes.func,
};

export default ExpandedEditorView;
