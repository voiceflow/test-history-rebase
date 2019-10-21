import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import Modal, { ModalBody } from '@/components/Modal';
import { clearModal } from '@/ducks/modal';
import { connect } from '@/hocs';

export const ErrorModal = ({ error, dismiss }) => {
  if (!error) {
    return null;
  }

  return (
    <Modal isOpen={!!error} centered size="sm">
      <ModalBody className="text-center">
        <h5>
          <i className="fas fa-exclamation-triangle text-danger" /> Error
        </h5>
        {error.message ? (
          <>
            <Alert color="danger">{error.message}</Alert>
            {error.violations
              ? error.violations.map((violation, i) => (
                  <Alert color="danger" key={i}>
                    {violation.message}
                  </Alert>
                ))
              : null}
          </>
        ) : (
          <Alert color="danger">{typeof error === 'string' ? error : error.error}</Alert>
        )}
        <hr />
        <Button isPrimary onClick={dismiss}>
          Return <i className="fas fa-undo" />
        </Button>
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  error: state.modal.errorModal,
});

const mapDispatchToProps = {
  dismiss: clearModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);
