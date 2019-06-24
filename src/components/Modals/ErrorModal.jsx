import Button from 'components/Button';
import { clearModal } from 'ducks/modal';
import React from 'react';
import { connect } from 'react-redux';
import { Alert, Modal, ModalBody } from 'reactstrap';

const ErrorModal = ({ error, dismiss }) => {
  if (!error) return null;
  return (
    <Modal isOpen={!!error} centered size="sm">
      <ModalBody className="text-center">
        <h5>
          <i className="fas fa-exclamation-triangle text-danger" /> Error
        </h5>
        {error.message ? (
          <React.Fragment>
            <Alert color="danger">{error.message}</Alert>
            {error.violations
              ? error.violations.map((violation, i) => (
                  <Alert color="danger" key={i}>
                    {violation.message}
                  </Alert>
                ))
              : null}
          </React.Fragment>
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

export { ErrorModal };

const mapStateToProps = (state) => ({
  error: state.modal.errorModal,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(clearModal()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorModal);
