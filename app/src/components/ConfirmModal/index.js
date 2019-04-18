import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../Modal';
import Button from '../Button';
import KeyHandler from '../KeyHandler';

export default function ConfirmModal(props) {
  const {
    opened,
    content,
    onSubmit,
    onCancel,
    headerText,
    submitButtonText,
    cancelButtonText,
  } = props;

  return (
    <Modal
      show={opened}
      onHide={onCancel}
      renderBody={() => content}
      withBigIcon
      renderHeader={() => <h2 className="modal-title">{headerText}</h2>}
      renderFooter={() => (
        <div className="modal-footer-right">
          <Button onClick={onCancel} isFlat>
            {cancelButtonText}
          </Button>

          <KeyHandler keyValue="Enter" onKeyHandle={onSubmit} />
          <Button onClick={onSubmit} isPrimary>
            {submitButtonText}
          </Button>
        </div>
      )}
    />
  );
}

ConfirmModal.propTypes = {
  opened: PropTypes.bool.isRequired,
  content: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  headerText: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  cancelButtonText: PropTypes.string,
};

ConfirmModal.defaultProps = {
  cancelButtonText: 'Cancel',
};
