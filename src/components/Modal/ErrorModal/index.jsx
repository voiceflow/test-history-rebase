import React from 'react';
import { Alert } from 'reactstrap';

import SvgIcon from '@/components/SvgIcon';
import Button from '@/componentsV2/Button';
import { clearModal } from '@/ducks/modal';
import { connect } from '@/hocs';

import { Modal, ModalBody, ModalFooter, ModalHeader } from '../components';

export const ErrorModal = ({ error, dismiss }) => {
  if (!error) {
    return null;
  }

  return (
    <Modal isOpen={!!error} centered modalWidth={350}>
      <ModalHeader header="ERROR OCCURED" toggle={dismiss} />
      <ModalBody className="text-center">
        <SvgIcon icon="connectSupport" size="auto" />
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
      </ModalBody>
      <ModalFooter>
        <Button variant="tertiary" onClick={dismiss}>
          Return
        </Button>
      </ModalFooter>
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
